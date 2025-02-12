from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class AutoDetectionMode:
    combinationId : int = -1
    interval : int = -1
    sub_mode : int = -1
    operation_type :int = None
    modeOn : bool = False
    is_running : bool = False

@dataclass
class AutoModeType:
    simple_detect : str = "simple_detect"
    exercise_detect : str = "exercise_detect"
    relax_detect : str = "relax_detect"
    stink_detect : str = "stink_detect"
    no_running : str = "no_running"

@dataclass
class Mode:
    operation_mode: int = 0
    auto_operation_mode: Dict[int, AutoDetectionMode] = field(default_factory=dict)
