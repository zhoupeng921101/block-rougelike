extends Node



signal temp_stat_updated(stat_name, value)

var stats = null
var player = null


func reset() -> void:
	stats = init_stats()


func get_signal_name() -> String:
	return "temp_stat_updated"


func set_stat(stat_name: String, value: int) -> void:
	stats[stat_name] = value
	emit_signal(get_signal_name(), stat_name, value)


func add_stat(stat_name: String, value: int) -> void:
	stats[stat_name] += value
	emit_signal(get_signal_name(), stat_name, value)


func remove_stat(stat_name: String, value: int) -> void:
	stats[stat_name] -= value
	emit_signal(get_signal_name(), stat_name, -value)


func get_stat(stat_name: String) -> int:
	if stat_name in stats:
		return stats[stat_name] * RunData.get_stat_gain(stat_name)
	else:
		return 0


func init_stats() -> Dictionary:
	return RunData.init_stats(true)
