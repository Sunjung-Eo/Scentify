import argparse
import json
import cv2
import torch
from pytorchvideo.models import create_slowfast
from torchvision.transforms import Compose
import torch.nn.functional as F
import numpy as np
from utils import num_classes, test_transform

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Test Model on Webcam Video')
    parser.add_argument('--model_path', default='./model/slow_fast.pth', type=str, help='Model path')
    parser.add_argument('--duration', default=3, type=int, help='Clip duration in seconds')
    
    opt = parser.parse_args()
    model_path = opt.model_path
    clip_duration = opt.duration

    # Load the model
    slow_fast = create_slowfast(model_num_class=num_classes).cuda()
    slow_fast.blocks[6].proj = torch.nn.Linear(
        slow_fast.blocks[6].proj.in_features,
        num_classes
    ).cuda()

    slow_fast.load_state_dict(torch.load(model_path, map_location='cuda'))
    slow_fast = slow_fast.cuda().eval()

    # Load class names
    with open('classnames.json', 'r') as f:
        kinetics_classnames = json.load(f)

    kinetics_id_to_classname = {v: str(k).replace('"', "") for k, v in kinetics_classnames.items()}

    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot open webcam.")
        exit()

    frame_rate = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = 65

    while True:
        frames = []
        
        # Display Recording message
        for _ in range(total_frames):
            ret, frame = cap.read()
            if not ret:
                print("Error: Cannot read frame from webcam.")
                exit()
            
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame)
            
            # Display Recording message on screen
            frame_disp = cv2.putText(frame.copy(), "Recording...", (50, 50), 
                                     cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            #cv2.imshow("Webcam", frame_disp)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                cap.release()
                cv2.destroyAllWindows()
                exit()

        # Convert to tensor and preprocess
        frames = np.stack(frames, axis=0)
        frames = torch.from_numpy(frames).permute(3, 0, 1, 2).float()
        frames = test_transform({"video": frames})["video"]
        frames = [frame.cuda() for frame in frames]
        inputs = [i[None, ...] for i in frames]

        # Display Analyzing message
        analysis_frame = frame.copy()
        analysis_frame = cv2.putText(analysis_frame, "Analyzing Action...", (50, 50), 
                                     cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        cv2.imshow("Webcam", analysis_frame)
        cv2.waitKey(1000)  # Display for 1 second

        # Perform inference
        pred = slow_fast(inputs)
        probabilities = F.softmax(pred, dim=1)

        # Get top 4 predictions
        top4 = probabilities.topk(k=4)
        pred_classes = top4.indices
        pred_probs = top4.values

        pred_class_names_probs = [
            (kinetics_id_to_classname[int(cls)], float(prob))
            for cls, prob in zip(pred_classes[0], pred_probs[0])
        ]

        # Display Prediction Results on Frame
        result_frame = frame.copy()
        y_offset = 50
        for class_name, prob in pred_class_names_probs:
            text = f"{class_name}: {prob:.4f}"
            result_frame = cv2.putText(result_frame, text, (50, y_offset), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            y_offset += 40

        cv2.imshow("Webcam", result_frame)
        cv2.waitKey(1000)  # Display results for 1 second

        print("\nPredicted Actions:")
        for class_name, prob in pred_class_names_probs:
            print(f"{class_name}: {prob:.4f}")

        print("\nPress 'q' to exit or any other key to classify another clip.")
        key = cv2.waitKey(3000)
        if key & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
