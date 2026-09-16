


















extends Node











const DEBUG_ENABLE_STORING_FILEPATHS = false



var BROTATO_DIR = OS.get_system_dir(3) + "/Brotato/"
var MOD_LOG_PATH = BROTATO_DIR + "mods.log"
var UNPACKED_DIR = BROTATO_DIR + "mods-unpacked/"



const REQUIRE_CMD_LINE = false


const LOG_NAME = "ModLoader"






var mod_data = {}


var mod_load_order = []






var os_mods_path_override = ""





var os_configs_path_override = ""



var mod_missing_dependencies = {}


var _saved_objects = []





func _init():

	if REQUIRE_CMD_LINE and not ModLoaderUtils.is_running_with_command_line_arg("--enable-mods"):
		return


	ModLoaderUtils.log_info("game_install_directory: %s" % ModLoaderUtils.get_local_folder_dir(), LOG_NAME)


	var cmd_line_mod_path := ModLoaderUtils.get_cmd_line_arg_value("--mods-path")
	if cmd_line_mod_path != "":
		os_mods_path_override = cmd_line_mod_path
		ModLoaderUtils.log_info("The path mods are loaded from has been changed via the CLI arg `--mods-path`, to: " + cmd_line_mod_path, LOG_NAME)


	var cmd_line_configs_path = ModLoaderUtils.get_cmd_line_arg_value("--configs-path")
	if cmd_line_configs_path != "":
		os_configs_path_override = cmd_line_configs_path
		ModLoaderUtils.log_info("The path configs are loaded from has been changed via the CLI arg `--configs-path`, to: " + cmd_line_configs_path, LOG_NAME)



	var unzipped_mods = _load_mod_zips()
	if (unzipped_mods > 0):
		ModLoaderUtils.log_success("DONE: Loaded %s mod files into the virtual filesystem" % unzipped_mods, LOG_NAME)
	else:
		ModLoaderUtils.log_info("No zipped mods found", LOG_NAME)



	var setup_mods = _setup_mods()
	if (setup_mods > 0):
		ModLoaderUtils.log_success("DONE: Setup %s mods" % setup_mods, LOG_NAME)
	else:
		ModLoaderUtils.log_info("No mods were setup", LOG_NAME)



	_load_mod_configs()





	for dir_name in mod_data:
		var mod: ModData = mod_data[dir_name]
		mod.load_manifest()

	ModLoaderUtils.log_success("DONE: Loaded all meta data", LOG_NAME)



	for dir_name in mod_data:
		var mod: ModData = mod_data[dir_name]
		if not mod.is_loadable:
			continue
		_check_dependencies(dir_name, mod.manifest.dependencies)


	_get_load_order()


	var mod_i = 1
	for mod in mod_load_order:
		mod = mod as ModData
		ModLoaderUtils.log_debug("mod_load_order -> %s) %s" % [mod_i, mod.dir_name], LOG_NAME)
		mod_i += 1


	for mod in mod_load_order:
		ModLoaderUtils.log_info("Initializing -> %s" % mod.manifest.get_mod_id(), LOG_NAME)
		_init_mod(mod)

	ModLoaderUtils.log_debug_json_print("mod data", mod_data, LOG_NAME)

	ModLoaderUtils.log_success("DONE: Completely finished loading mods", LOG_NAME)




func _load_mod_zips() -> int:

	var steam_app_id: String = ModLoaderUtils.get_steam_app_id()


	var game_mod_folder_path = ModLoaderUtils.get_local_folder_dir("", "workshop/content/" + steam_app_id)

	var global_dir = Directory.new()
	if global_dir.open(game_mod_folder_path) != OK:
		if not OS.has_feature("editor"):
			ModLoaderUtils.log_error("Can't open mod folder %s." % game_mod_folder_path, LOG_NAME)
		return -1
	if global_dir.list_dir_begin(true) != OK:
		ModLoaderUtils.log_error("Can't read mod folder %s." % game_mod_folder_path, LOG_NAME)
		return -1

	var has_shown_editor_warning = false

	var zipped_mods_count = 0


	while true:

		var current_dir = global_dir.get_next()

		if current_dir == "":
			break

		if not global_dir.current_is_dir():
			continue

		var dir = Directory.new()

		if dir.open(game_mod_folder_path.plus_file(current_dir)) != OK:
			ModLoaderUtils.log_error("Can't open mod folder %s." % game_mod_folder_path.plus_file(current_dir), LOG_NAME)
			return -1
		if dir.list_dir_begin() != OK:
			ModLoaderUtils.log_error("Can't read mod folder %s." % current_dir, LOG_NAME)
			return -1

		while true:

			var mod_zip_file_name = dir.get_next()


			if mod_zip_file_name == "":

				break


			if mod_zip_file_name.get_extension() != "zip" and mod_zip_file_name.get_extension() != "pck":
				continue


			if dir.current_is_dir():

				continue

			var mod_folder_path = game_mod_folder_path.plus_file(current_dir).plus_file(mod_zip_file_name)
			var mod_folder_global_path = ProjectSettings.globalize_path(mod_folder_path)
			var is_mod_loaded_success = ProjectSettings.load_resource_pack(mod_folder_global_path, false)








			if OS.has_feature("editor") and not has_shown_editor_warning:
				ModLoaderUtils.log_warning(str(
					"Loading any resource packs (.zip/.pck) with `load_resource_pack` will WIPE the entire virtual res:// directory. ",
					"If you have any unpacked mods in ", UNPACKED_DIR, ", they will not be loaded. ",
					"Please unpack your mod ZIPs instead, and add them to ", UNPACKED_DIR), LOG_NAME)
				has_shown_editor_warning = true

			ModLoaderUtils.log_debug(str("Found mod ZIP: ", mod_folder_global_path), LOG_NAME)


			if not is_mod_loaded_success:

				ModLoaderUtils.log_error(str(mod_zip_file_name, " failed to load."), LOG_NAME)
				continue


			ModLoaderUtils.log_success(str(mod_zip_file_name, " loaded."), LOG_NAME)
			zipped_mods_count += 1

		dir.list_dir_end()

	global_dir.list_dir_end()
	return zipped_mods_count




func _setup_mods() -> int:

	var unpacked_mods_path = UNPACKED_DIR

	var dir = Directory.new()
	if dir.open(unpacked_mods_path) != OK:
		ModLoaderUtils.log_error("Can't open unpacked mods folder %s." % unpacked_mods_path, LOG_NAME)
		return -1
	if dir.list_dir_begin() != OK:
		ModLoaderUtils.log_error("Can't read unpacked mods folder %s." % unpacked_mods_path, LOG_NAME)
		return -1

	var unpacked_mods_count = 0

	while true:

		var mod_dir_name = dir.get_next()


		if mod_dir_name == "":

			break


		if not dir.current_is_dir():
			continue

		if mod_dir_name == "." or mod_dir_name == "..":
			continue


		_init_mod_data(mod_dir_name)
		unpacked_mods_count += 1

	dir.list_dir_end()
	return unpacked_mods_count



func _load_mod_configs():
	var found_configs_count = 0
	var configs_path = ModLoaderUtils.get_local_folder_dir("configs")



	if (os_configs_path_override != ""):
		configs_path = os_configs_path_override

	for dir_name in mod_data:
		var json_path = configs_path.plus_file(dir_name + ".json")
		var mod_config = ModLoaderUtils.get_json_as_dict(json_path)

		ModLoaderUtils.log_debug(str("Config JSON: Looking for config at path: ", json_path), LOG_NAME)

		if mod_config.size() > 0:
			found_configs_count += 1

			ModLoaderUtils.log_info(str("Config JSON: Found a config file: '", json_path, "'"), LOG_NAME)
			ModLoaderUtils.log_debug(str("Config JSON: File data: ", JSON.print(mod_config)), LOG_NAME)






			if mod_config.has("load_from"):
				var new_path = mod_config.load_from
				if new_path != "" and new_path != str(dir_name, ".json"):
					ModLoaderUtils.log_info(str("Config JSON: Following load_from path: ", new_path), LOG_NAME)
					var new_config = ModLoaderUtils.get_json_as_dict(configs_path + new_path)
					if new_config.size() > 0 != null:
						mod_config = new_config
						ModLoaderUtils.log_info(str("Config JSON: Loaded from custom json: ", new_path), LOG_NAME)
						ModLoaderUtils.log_debug(str("Config JSON: File data: ", JSON.print(mod_config)), LOG_NAME)
					else:
						ModLoaderUtils.log_error(str("Config JSON: ERROR - Could not load data via `load_from` for ", dir_name, ", at path: ", new_path), LOG_NAME)

			mod_data[dir_name].config = mod_config

	if found_configs_count > 0:
		ModLoaderUtils.log_success(str("Config JSON: Loaded ", str(found_configs_count), " config(s)"), LOG_NAME)
	else:
		ModLoaderUtils.log_info(str("Config JSON: No mod configs were found"), LOG_NAME)





func _init_mod_data(mod_folder_path):

	var dir_name = ModLoaderUtils.get_file_name_from_path(mod_folder_path, false, true)


	var local_mod_path = str(UNPACKED_DIR, dir_name)

	var mod := ModData.new(local_mod_path)
	mod.dir_name = dir_name
	mod_data[dir_name] = mod






	if DEBUG_ENABLE_STORING_FILEPATHS:
		mod.file_paths = ModLoaderUtils.get_flat_view_dict(local_mod_path)





func _check_dependencies(mod_id: String, deps: Array):
	ModLoaderUtils.log_debug(str("Checking dependencies - mod_id: ", mod_id, " dependencies: ", deps), LOG_NAME)


	for dependency_id in deps:

		if (not mod_data.has(dependency_id)):
			_handle_missing_dependency(mod_id, dependency_id)
			continue

		var dependency = mod_data[dependency_id]
		var dependency_mod_manifest = mod_data[dependency_id].manifest




		dependency.importance = dependency.importance + 1
		ModLoaderUtils.log_debug(str("Dependency -> ", dependency_id, " importance -> ", dependency.importance), LOG_NAME)


		if (dependency_mod_manifest.dependencies.size() > 0):
			_check_dependencies(dependency_id, dependency_mod_manifest.dependencies)



func _handle_missing_dependency(mod_id, dependency_id):
	ModLoaderUtils.log_error(str("Missing dependency - mod_id -> ", mod_id, " dependency_id -> ", dependency_id), LOG_NAME)

	if (not mod_missing_dependencies.has(mod_id)):

		mod_missing_dependencies[mod_id] = []

	mod_missing_dependencies[mod_id].append(dependency_id)

	mod_data[mod_id].is_loadable = false



func _get_load_order():
	var mod_data_array = mod_data.values()


	for mod in mod_data_array:
		if (mod.is_loadable):
			mod_load_order.append(mod)


	mod_load_order.sort_custom(self, "_compare_importance")



func _compare_importance(a, b):


	if (a.importance > b.importance):
		return true
	else:
		return false




func _init_mod(mod: ModData):
	var mod_main_path = mod.get_required_mod_file_path(ModData.required_mod_files.MOD_MAIN)

	ModLoaderUtils.log_debug("Loading script from -> %s" % mod_main_path, LOG_NAME)
	var mod_main_script = ResourceLoader.load(mod_main_path)
	ModLoaderUtils.log_debug("Loaded script -> %s" % mod_main_script, LOG_NAME)

	var mod_main_instance = mod_main_script.new(self)

	mod_main_instance.name = mod.manifest.get_mod_id()

	ModLoaderUtils.log_debug("Adding child -> %s" % mod_main_instance, LOG_NAME)
	add_child(mod_main_instance, true)













func install_script_extension(child_script_path: String):

	if not File.new().file_exists(child_script_path):
		ModLoaderUtils.log_error("The child script path '%s' does not exist" % [child_script_path], LOG_NAME)
		return

	var child_script = ResourceLoader.load(child_script_path)








	child_script.new()

	var parent_script = child_script.get_base_script()
	var parent_script_path = parent_script.resource_path
	ModLoaderUtils.log_info("Installing script extension: %s <- %s" % [parent_script_path, child_script_path], LOG_NAME)
	child_script.take_over_path(parent_script_path)





func add_translation_from_resource(resource_path: String):
	var translation_object = load(resource_path)
	TranslationServer.add_translation(translation_object)
	ModLoaderUtils.log_info(str("Added Translation from Resource -> ", resource_path), LOG_NAME)


func append_node_in_scene(modified_scene, node_name: String = "", node_parent = null, instance_path: String = "", is_visible: bool = true):
	var new_node
	if instance_path != "":
		new_node = load(instance_path).instance()
	else:
		new_node = Node.instance()
	if node_name != "":
		new_node.name = node_name
	if is_visible == false:
		new_node.visible = false
	if node_parent != null:
		var tmp_node = modified_scene.get_node(node_parent)
		tmp_node.add_child(new_node)
		new_node.set_owner(modified_scene)
	else:
		modified_scene.add_child(new_node)
		new_node.set_owner(modified_scene)


func save_scene(modified_scene, scene_path: String):
	var packed_scene = PackedScene.new()
	packed_scene.pack(modified_scene)
	ModLoaderUtils.log_debug(str("packing scene -> ", packed_scene), LOG_NAME)
	packed_scene.take_over_path(scene_path)
	ModLoaderUtils.log_debug(str("save_scene - taking over path - new path -> ", packed_scene.resource_path), LOG_NAME)
	_saved_objects.append(packed_scene)











func get_mod_config(mod_id: String = "", key: String = "") -> Dictionary:
	var error_num = 0
	var error_msg = ""
	var data = {}
	var defaults = null


	if not mod_data.has(mod_id):
		error_num = 1
		error_msg = str("ERROR - Mod ID was invalid: ", mod_id)


	if error_num == 0:
		var config_data = mod_data[mod_id].config
		defaults = mod_data[mod_id].manifest.config_defaults


		if config_data.size() == 0:
			error_num = 2
			error_msg = str("WARNING - No config file for ", mod_id, ".json. ")
			if key == "":
				data = defaults
				error_msg += "Using defaults (extra.godot.config_defaults)"
			else:
				if defaults.has(key):
					data = defaults[key]
					error_msg += str("Using defaults for key '", key, "' (extra.godot.config_defaults.", key, ")")
				else:
					error_num = 3

					error_msg += str("Requested key '", key, "' is not present in the defaults (extra.godot.config_defaults.", key, ")")


		if error_num == 0:
			if key == "":
				data = config_data
			else:
				if config_data.has(key):
					data = config_data[key]
				else:
					error_num = 4
					error_msg = str("WARNING - Invalid key '", key, "' for mod ID: ", mod_id)


	if error_num != 0:
		ModLoaderUtils.log_debug(str("Config: ", error_msg), mod_id)

	return {
		"error": error_num,
		"error_msg": error_msg,
		"data": data,
	}
