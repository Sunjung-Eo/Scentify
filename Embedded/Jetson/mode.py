from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class AutoDetectionMode:
    combination_id : int = -1
    interval : int = -1
    sub_mode : int = -1
    operation_type :int = None
    mode_on : bool = False

@dataclass
class Mode:
    operation_mode: int = 0
    auto_operation_mode: Dict[int, AutoDetectionMode] = field(default_factory=dict)
