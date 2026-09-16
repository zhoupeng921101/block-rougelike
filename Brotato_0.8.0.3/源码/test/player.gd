extends Sprite

export(NodePath) var joystickLeftPath
onready var joystickLeft: VirtualJoystick = get_node(joystickLeftPath)

export var speed: float = 100

export(NodePath) var joystickRightPath
onready var joystickRight: VirtualJoystick = get_node(joystickRightPath)

func _process(delta: float) -> void:





	var move := Vector2.ZERO
	move.x = Input.get_axis("ui_left", "ui_right")
	move.y = Input.get_axis("ui_up", "ui_down")
	position += move * speed * delta


	if joystickRight and joystickRight.is_pressed():
		rotation = joystickRight.get_output().angle()
