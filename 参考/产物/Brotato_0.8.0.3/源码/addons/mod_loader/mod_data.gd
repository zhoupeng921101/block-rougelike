extends Resource
class_name ModData




const LOG_NAME := "ModLoader:ModData"




enum required_mod_files {
	MOD_MAIN,
	MANIFEST,
}


var dir_name := ""

var dir_path := ""

var is_loadable := true

var importance := 0

var manifest: ModManifest

var config := {}


var file_paths := []


func _init(_dir_path: String) -> void:
	dir_path = _dir_path



func load_manifest() -> void:
	if not has_required_files():
		return

	ModLoaderUtils.log_info("Loading mod_manifest (manifest.json) for -> %s" % dir_name, LOG_NAME)


	var manifest_path := get_required_mod_file_path(required_mod_files.MANIFEST)
	var manifest_dict := ModLoaderUtils.get_json_as_dict(manifest_path)
	ModLoaderUtils.log_debug_json_print("%s loaded manifest data -> " % dir_name, manifest_dict, LOG_NAME)

	var mod_manifest := ModManifest.new(manifest_dict)

	is_loadable = has_manifest(mod_manifest)
	if not is_loadable: return
	is_loadable = is_mod_dir_name_same_as_id(mod_manifest)
	if not is_loadable: return
	manifest = mod_manifest



func is_mod_dir_name_same_as_id(mod_manifest: ModManifest) -> bool:
	var manifest_id := mod_manifest.get_mod_id()
	if not dir_name == manifest_id:
		ModLoaderUtils.log_fatal("Mod directory name \"%s\" does not match the data in manifest.json. Expected \"%s\" (Format: {namespace}-{name})" % [dir_name, manifest_id], LOG_NAME)
		return false
	return true



func has_required_files() -> bool:
	var file_check := File.new()

	for required_file in required_mod_files:
		var file_path := get_required_mod_file_path(required_mod_files[required_file])

		if not file_check.file_exists(file_path):
			ModLoaderUtils.log_fatal("ERROR - %s is missing a required file: %s" % [dir_name, file_path], LOG_NAME)
			is_loadable = false
	return is_loadable



func has_manifest(mod_manifest: ModManifest) -> bool:
	if mod_manifest == null:
		ModLoaderUtils.log_fatal("Mod manifest could not be created correctly due to errors.", LOG_NAME)
		return false
	return true



func get_required_mod_file_path(required_file: int) -> String:
	match required_file:
		required_mod_files.MOD_MAIN:
			return dir_path.plus_file("mod_main.gd")
		required_mod_files.MANIFEST:
			return dir_path.plus_file("manifest.json")
	return ""
