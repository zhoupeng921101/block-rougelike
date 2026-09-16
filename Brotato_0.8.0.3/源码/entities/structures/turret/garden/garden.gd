class_name Garden
extends Turret


func shoot() -> void:
	.shoot()
	emit_signal("wanted_to_spawn_fruit", global_position)
