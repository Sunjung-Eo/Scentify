auto_mode_init_data = {
    "schedules" : [
        {
            "id" : 2,
            "combinationId" : 1,
            "subMode" : 0,
            "type" : None,
            "interval" : 15,
            "modeOn" : False,
        },
        {
            "id" : 3,
            "combinationId" : 5,
            "subMode" : 1,
            "type" : 1,
            "interval" : 0,
            "modeOn" : False
        },
        {
            "id" : 4,
            "combinationId" : 5,
            "subMode" : 1,
            "type" : 2,
            "interval" : 15,
            "modeOn" : False
        },
        {
            "id" : 5,
            "combinationId" : 7,
            "subMode" : 2,
            "type" : None,
            "interval" : 15,
            "modeOn" : False
        },
    ]
}

exercise_mode_change_data = {
    "id" : 3,
    "modeOn" : True,
}

relax_mode_change_data = {
    "id" : 4,
    "modeOn" : True,
}

simple_detection_change_data = {
    "id" : 2,
    "modeOn" : True,
}


schedule_data = {
    "schedules": [
        {
            "id": "1",
            "deviceId": "A1",
            "combination": {
                "choice1": 1, "choice1Count": 3,
                "choice2": 2, "choice2Count": 2,
                "choice3": None, "choice3Count": None,
                "choice4": None, "choice4Count": None
            },
            "startTime": "18:00:00",
            "endTime": "18:30:00",
            "interval": 15,
            "modeOn": True
        },
        {
            "id": "2",
            "deviceId": "B2",
            "combination": {
                "choice1": 2, "choice1Count": 2,
                "choice2": 1, "choice2Count": 3,
                "choice3": None, "choice3Count": None,
                "choice4": None, "choice4Count": None
            },
            "startTime": "09:00:00",
            "endTime": "10:00:00",
            "interval": 10,
            "modeOn": False
        },
        {
            "id": "3",
            "deviceId": "C3",
            "combination": {
                "choice1": 3, "choice1Count": 1,
                "choice2": 1, "choice2Count": 2,
                "choice3": None, "choice3Count": None,
                "choice4": None, "choice4Count": None
            },
            "startTime": "12:30:00",
            "endTime": "13:30:00",
            "interval": 20,
            "modeOn": True
        }
    ]
}