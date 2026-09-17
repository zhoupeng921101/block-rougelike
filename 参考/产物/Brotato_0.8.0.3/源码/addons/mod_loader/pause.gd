extends Node


func _ready():
	OS.request_permissions()
	get_tree().change_scene("res://ui/menus/title_screen/title_screen.tscn")
