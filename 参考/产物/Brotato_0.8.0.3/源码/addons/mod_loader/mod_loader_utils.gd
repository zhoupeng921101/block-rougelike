extends Node
class_name ModLoaderUtils

const LOG_NAME := "ModLoader:ModLoaderUtils"
const MOD_LOG_PATH := "user://mods.log"

enum verbosity_level {
	ERROR,
	WARNING,
	INFO,
	DEBUG,
}




static func log_fatal(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "fatal-error")




static func log_error(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "error")




static func log_warning(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "warning")




static func log_info(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "info")




static func log_success(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "success")




static func log_debug(message: String, mod_name: String) -> void:
	_loader_log(message, mod_name, "debug")




static func log_debug_json_print(message: String, json_printable, mod_name: String) -> void:
	message = "%s\n%s" % [message, JSON.print(json_printable, "  ")]
	_loader_log(message, mod_name, "debug")


static func _loader_log(message: String, mod_name: String, log_type: String = "info") -> void:
	if is_mod_name_ignored(mod_name):
		return

	var date := "%s   " % get_date_time_string()
	var prefix := "%s %s: " % [log_type.to_upper(), mod_name]
	var log_message := date + prefix + message

	match log_type.to_lower():
		"fatal-error":
			_write_to_log_file(log_message)
			_write_to_log_file(JSON.print(get_stack(), "  "))
			assert (false, message)
		"error":
			printerr(message)
			push_error(message)
			_write_to_log_file(log_message)
		"warning":
			if _get_verbosity() >= verbosity_level.WARNING:
				print(prefix + message)
				push_warning(message)
				_write_to_log_file(log_message)
		"info", "success":
			if _get_verbosity() >= verbosity_level.INFO:
				print(prefix + message)
				_write_to_log_file(log_message)
		"debug":
			if _get_verbosity() >= verbosity_level.DEBUG:
				print(prefix + message)
				_write_to_log_file(log_message)


static func is_mod_name_ignored(mod_name: String) -> bool:
	var ignored_arg := get_cmd_line_arg_value("--log-ignore")

	if not ignored_arg == "":
		var ignored_names: Array = ignored_arg.split(",")
		if mod_name in ignored_names:
			return true
	return false


static func _write_to_log_file(log_entry: String) -> void:
	var log_file := File.new()

	if not log_file.file_exists(MOD_LOG_PATH):
		log_file.open(MOD_LOG_PATH, File.WRITE)
		log_file.store_string("%s\t Created mod.log!" % get_date_time_string())
		log_file.close()

	var _error: int = log_file.open(MOD_LOG_PATH, File.READ_WRITE)
	if not _error == OK:
		assert (false, "Could not open log file, error code: %s" % _error)
		return

	log_file.seek_end()
	log_file.store_string("\n" + log_entry)
	log_file.close()


static func _get_verbosity() -> int:
	if is_running_with_command_line_arg("-vvv") or is_running_with_command_line_arg("--log-debug"):
		return verbosity_level.DEBUG
	if is_running_with_command_line_arg("-vv") or is_running_with_command_line_arg("--log-info"):
		return verbosity_level.INFO
	if is_running_with_command_line_arg("-v") or is_running_with_command_line_arg("--log-warning"):
		return verbosity_level.WARNING

	if OS.has_feature("editor"):
		return verbosity_level.DEBUG

	return verbosity_level.ERROR



static func is_running_with_command_line_arg(argument: String) -> bool:
	for arg in OS.get_cmdline_args():
		if arg == argument:
			return true

	return false



static func get_cmd_line_arg_value(argument: String) -> String:
	for arg in OS.get_cmdline_args():
		if (arg as String).find("=") > -1:
			var key_value := (arg as String).split("=")


			if key_value[0] == argument:
				return key_value[1]

	return ""



static func get_date_time_string() -> String:
	var date_time = Time.get_datetime_dict_from_system()

	return "%02d.%02d.%s-%02d:%02d:%02d" % [
		date_time.day, date_time.month, date_time.year,
		date_time.hour, date_time.minute, date_time.second
	]




static func get_local_folder_dir(subfolder: String = "", external_folder: String = "") -> String:
	var game_install_directory := OS.get_executable_path().get_base_dir()

	if OS.get_name() == "OSX":
		game_install_directory = game_install_directory.get_base_dir().get_base_dir()




	if OS.has_feature("editor"):
		game_install_directory = "res://"
		return game_install_directory + external_folder

	if external_folder == "":
		return game_install_directory.plus_file(subfolder)
	else:
		var path_array = game_install_directory.split("/")
		path_array.resize(path_array.size() - 2)
		var path = ""
		for folder in path_array:
			path += folder + "/"
		path += external_folder
		return path



static func get_file_name_from_path(path: String, make_lower_case := true, remove_extension := false) -> String:
	var file_name := path.get_file()

	if make_lower_case:
		file_name = file_name.to_lower()

	if remove_extension:
		file_name = file_name.trim_suffix("." + file_name.get_extension())

	return file_name




static func get_json_as_dict(path: String) -> Dictionary:
	var file := File.new()

	if not file.file_exists(path):
		file.close()
		return {}

	var error = file.open(path, File.READ)
	if not error == OK:
		log_error("Error opening file. Code: %s" % error, LOG_NAME)

	var content := file.get_as_text()
	return get_json_string_as_dict(content)




static func get_json_string_as_dict(string: String) -> Dictionary:
	if string == "":
		return {}
	var parsed := JSON.parse(string)
	if parsed.error:
		log_error("Error parsing JSON", LOG_NAME)
		return {}
	if not parsed.result is Dictionary:
		log_error("JSON is not a dictionary", LOG_NAME)
		return {}
	return parsed.result






static func get_flat_view_dict(p_dir := "res://", p_match := "", p_match_is_regex := false) -> Array:
	var regex: RegEx
	if p_match_is_regex:
		regex = RegEx.new()
		regex.compile(p_match)
		if not regex.is_valid():
			return []

	var dirs := [p_dir]
	var first := true
	var data := []
	while not dirs.empty():
		var dir := Directory.new()
		var dir_name: String = dirs.back()
		dirs.pop_back()

		if dir.open(dir_name) == OK:
			dir.list_dir_begin()
			var file_name := dir.get_next()
			while file_name != "":
				if not dir_name == "res://":
					first = false

				if not file_name.begins_with(".") and not file_name.get_extension() in ["tmp", "import"]:

					if dir.current_is_dir():
						dirs.push_back(dir.get_current_dir().plus_file(file_name))

					else:
						var path := dir.get_current_dir() + ("/" if not first else "") + file_name

						if not p_match:
							data.append(path)

						elif not p_match_is_regex and file_name.find(p_match, 0) != -1:
							data.append(path)

						else:
							var regex_match := regex.search(path)
							if regex_match != null:
								data.append(path)

				file_name = dir.get_next()

			dir.list_dir_end()
	return data


static func get_steam_app_id() -> String:
	var game_install_directory = get_local_folder_dir()
	var steam_app_id = ""
	var file = File.new()

	if file.open(game_install_directory.plus_file("steam_data.json"), File.READ) == OK:
		var file_content: Dictionary = parse_json(file.get_as_text())
		file.close()

		if not file_content.has("app_id"):
			log_error("The steam_data file does not contain an app ID, mod uploading will not work.", LOG_NAME)
			return ""

		steam_app_id = file_content.app_id
	else:
		log_error("Can't open steam_data file %s. Please make sure the file exists and is valid." % game_install_directory.plus_file("steam_data.json"), LOG_NAME)

	return steam_app_id
