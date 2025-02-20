import json
import torch
import torch.nn.functional as F
import numpy as np

from pytorchvideo.models import create_slowfast
from torchvision.transforms import Compose
from slowfast_utils import *
from enum import Enum

class Action(Enum):
    Nothing = 0
    Exercise = 1
    Relax = 2

class SlowFast:
    def __init__(self):
        self.print_log = False
        self.required_frames_num = 65

        self.th_squat = 0.60
        self.th_pushup = 0.37
        self.th_relax = 0.4
        self.th_situp = 0.4

        self.active_relax_mode = True
        self.active_exercise_mode = True

        # Load SlowFast Model
        self.cur_dir = "/home/jetpack/S12P11A205/Embedded/AI/modules"
        self.model_path = f"{self.cur_dir}/model/slow_fast_lr=5e-4.pth"
        self.model = create_slowfast(model_num_class=num_classes).cuda()
        self.model.blocks[6].proj = torch.nn.Linear(
            self.model.blocks[6].proj.in_features,
            num_classes
        ).cuda()
        self.model.load_state_dict(torch.load(self.model_path, map_location='cuda'))
        self.model = self.model.cuda().eval()

        print("Load SlowFast Model Module")

        # Get Class Name
        with open(f'{self.cur_dir}/classnames.json', 'r') as f:
            self.classnames = json.load(f)

        self.id_to_classname = {v: str(k).replace('"', "") for k, v in self.classnames.items()}

    def analyze_action(self, frames):
        if len(frames) < self.required_frames_num:
            print("Require More Frames")

        frames = np.stack(frames, axis=0)
        frames = torch.from_numpy(frames).permute(3, 0, 1, 2).float()
        frames = test_transform({"video": frames})["video"]
        frames = [frame.cuda() for frame in frames]
        inputs = [i[None, ...] for i in frames]

        pred = self.model(inputs)
        probabilities = F.softmax(pred, dim=1)

        # Get top 4 predictions
        top4 = probabilities.topk(k=4)
        pred_classes = top4.indices
        pred_probs = top4.values

        pred_class_names_probs = [
            (self.id_to_classname[int(cls)], float(prob))
            for cls, prob in zip(pred_classes[0], pred_probs[0])
        ]

        if self.print_log:
            for (class_name, probs) in pred_class_names_probs:
                print(f"{class_name} : {probs}")
        """
        pred_class_names_probs
        높은 확률로 정렬된 행동 클래스 및 확률
        pred_class_names_probs[n] : n번째로 높은 확률로 분류된 행동
        pred_class_names_probs[n][0] : 클래스 str
        pred_class_names_probs[n][1] : 확률률
        """

        if pred_class_names_probs[0][0] == "squat" and self.active_exercise_mode:
            if pred_class_names_probs[0][1] >= self.th_squat:
                return Action.Exercise
            else:
                return Action.Nothing
            
        elif pred_class_names_probs[0][0] == "push_up" and self.active_exercise_mode:
            if pred_class_names_probs[0][1] >= self.th_pushup:
                return Action.Exercise
            else:
                return Action.Nothing
            
        elif pred_class_names_probs[0][0] == "situp" and self.active_exercise_mode:
            if pred_class_names_probs[0][1] >= self.th_situp:
                return Action.Exercise
            else:
                return Action.Nothing
            
        elif pred_class_names_probs[0][0] == "relax" and self.active_relax_mode:
            if pred_class_names_probs[0][1] >= self.th_relax:
                return Action.Relax
            else:
                return Action.Nothing
            
        return Action.Nothing




        
