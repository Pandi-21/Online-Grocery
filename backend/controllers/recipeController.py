# # from flask import request, jsonify, current_app
# # import datetime
# # from bson.objectid import ObjectId, InvalidId
# # # controllers/recipeController.py
# # from utils.helpers import slugify, parse_list, save_images, object_id_str


# # # ---------- Create Recipe ----------
# # def create_recipe():
# #     db = current_app.db
# #     data = request.form if request.form else request.json

# #     title = (data.get("title") or "").strip()
# #     subcategory_id = data.get("subcategory_id")
# #     if not title or not subcategory_id:
# #         return jsonify({"error": "title and subcategory required"}), 400

# #     parent_sub = db.subcategories.find_one({"_id": ObjectId(subcategory_id)})
# #     if not parent_sub:
# #         return jsonify({"error": "invalid subcategory"}), 400

# #     recipe = {
# #         "title": title,
# #         "slug": slugify(title),
# #         "category": "Recipes",
# #         "category_id": parent_sub["category_id"],
# #         "subcategory": parent_sub["name"],
# #         "subcategory_id": parent_sub["_id"],
# #         "subcategory_slug": slugify(parent_sub["name"]),
# #         "ingredients": parse_list(data, "ingredients"),
# #         "steps": parse_list(data, "steps"),
# #         "tags": parse_list(data, "tags"),
# #         "images": save_images(request.files),
# #         "created_at": datetime.datetime.utcnow(),
# #         "updated_at": datetime.datetime.utcnow()
# #     }

# #     res = db.recipes.insert_one(recipe)
# #     recipe["_id"] = str(res.inserted_id)
# #     recipe["subcategory_id"] = str(recipe["subcategory_id"])
# #     recipe["category_id"] = str(recipe["category_id"])

# #     return jsonify({"message": "created", "recipe": recipe}), 201

# # # ---------- Get Recipe by ID ----------
# # def get_recipe_by_id(id):
# #     db = current_app.db
# #     try:
# #         r = db.recipes.find_one({"_id": ObjectId(id)})
# #     except InvalidId:
# #         return jsonify({"error": "invalid id"}), 400
# #     if not r:
# #         return jsonify({"error": "not found"}), 404
# #     return jsonify(object_id_str(r))

# # # ---------- Get Recipe by Slug ----------
# # def get_recipe_by_slug(slug):
# #     db = current_app.db
# #     r = db.recipes.find_one({"slug": slug})
# #     if not r:
# #         return jsonify({"error": "not found"}), 404
# #     return jsonify(object_id_str(r))

# # # ---------- Get Recipe by Subcategory & Slug ----------
# # def get_recipe_by_subcategory_and_slug(subcategory_slug, recipe_slug):
# #     db = current_app.db
# #     sub = db.subcategories.find_one({"slug": subcategory_slug})
# #     if not sub:
# #         return jsonify({"error": "subcategory not found"}), 404

# #     r = db.recipes.find_one({"slug": recipe_slug, "subcategory_id": sub["_id"]})
# #     if not r:
# #         return jsonify({"error": "recipe not found"}), 404
# #     return jsonify(object_id_str(r))

# # # ---------- List / Filter Recipes ----------
# # def list_recipes():
# #     db = current_app.db
# #     query = {"category": "Recipes"}

# #     qtext = request.args.get("q")
# #     if qtext:
# #         query["$or"] = [
# #             {"title": {"$regex": qtext, "$options": "i"}},
# #             {"tags": {"$regex": qtext, "$options": "i"}}
# #         ]

# #     sub_slug = request.args.get("subcategory")
# #     if sub_slug:
# #         sub = db.subcategories.find_one({"slug": sub_slug})
# #         if sub:
# #             query["subcategory_id"] = sub["_id"]

# #     recipes = list(db.recipes.find(query).sort("created_at", -1))
# #     return jsonify([object_id_str(r) for r in recipes])

# # # ---------- Update Recipe ----------
# # def update_recipe(id):
# #     db = current_app.db
# #     try:
# #         recipe = db.recipes.find_one({"_id": ObjectId(id)})
# #     except InvalidId:
# #         return jsonify({"error": "invalid id"}), 400
# #     if not recipe:
# #         return jsonify({"error": "not found"}), 404

# #     data = request.form if request.form else request.json
# #     update = {}

# #     if data.get("title"):
# #         update["title"] = data.get("title").strip()
# #         update["slug"] = slugify(data.get("title"))

# #     if data.get("subcategory_id"):
# #         parent_sub = db.subcategories.find_one({"_id": ObjectId(data.get("subcategory_id"))})
# #         if parent_sub:
# #             update["subcategory"] = parent_sub["name"]
# #             update["subcategory_id"] = parent_sub["_id"]
# #             update["category_id"] = parent_sub["category_id"]
# #             update["subcategory_slug"] = slugify(parent_sub["name"])

# #     for key in ["ingredients", "steps", "tags"]:
# #         val = parse_list(data, key)
# #         if val is not None:
# #             update[key] = val

# #     existing = data.get("existingImages")
# #     if existing:
# #         try:
# #             update["images"] = json.loads(existing)
# #         except:
# #             update["images"] = existing.split(",")
# #     else:
# #         update["images"] = recipe.get("images", [])

# #     update["images"] += save_images(request.files)
# #     update["updated_at"] = datetime.datetime.utcnow()
# #     db.recipes.update_one({"_id": ObjectId(id)}, {"$set": update})
# #     return jsonify({"message": "updated"})

# # # ---------- Delete Recipe ----------
# # def delete_recipe(id):
# #     db = current_app.db
# #     try:
# #         db.recipes.delete_one({"_id": ObjectId(id)})
# #     except InvalidId:
# #         return jsonify({"error": "invalid id"}), 400
# #     return jsonify({"message": "deleted"})
# from flask import request, jsonify, current_app
# import datetime, json
# from bson.objectid import ObjectId, InvalidId
# from utils.helpers import slugify, parse_list, save_images, object_id_str

# # ---------- Create Recipe ----------
# def create_recipe():
#     db = current_app.db
#     data = request.form if request.form else request.json

#     title = (data.get("title") or "").strip()
#     subcategory_id = data.get("subcategory_id")
#     if not title or not subcategory_id:
#         return jsonify({"error": "title and subcategory required"}), 400

#     parent_sub = db.subcategories.find_one({"_id": ObjectId(subcategory_id)})
#     if not parent_sub:
#         return jsonify({"error": "invalid subcategory"}), 400

#     recipe = {
#         "title": title,
#         "slug": slugify(title),
#         "category": "Recipes",
#         "category_id": parent_sub["category_id"],
#         "subcategory": parent_sub["name"],
#         "subcategory_id": parent_sub["_id"],
#         "subcategory_slug": slugify(parent_sub["name"]),
#         "ingredients": parse_list(data, "ingredients"),
#         "steps": parse_list(data, "steps"),
#         "tags": parse_list(data, "tags"),
#         "images": save_images(request.files),
#         "created_at": datetime.datetime.utcnow(),
#         "updated_at": datetime.datetime.utcnow()
#     }

#     res = db.recipes.insert_one(recipe)
#     recipe["_id"] = str(res.inserted_id)
#     recipe["subcategory_id"] = str(recipe["subcategory_id"])
#     recipe["category_id"] = str(recipe["category_id"])

#     return jsonify({"message": "created", "recipe": recipe}), 201

# # ---------- Get Recipe by ID ----------
# def get_recipe_by_id(id):
#     db = current_app.db
#     try:
#         r = db.recipes.find_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "invalid id"}), 400
#     if not r:
#         return jsonify({"error": "not found"}), 404
#     return jsonify(object_id_str(r))

# # ---------- Get Recipe by Slug ----------
# def get_recipe_by_slug(slug):
#     db = current_app.db
#     r = db.recipes.find_one({"slug": slug})
#     if not r:
#         return jsonify({"error": "not found"}), 404
#     return jsonify(object_id_str(r))

# # ---------- Get Recipe by Subcategory & Slug ----------
# def get_recipe_by_subcategory_and_slug(subcategory_slug, recipe_slug):
#     db = current_app.db
#     sub = db.subcategories.find_one({"slug": subcategory_slug})
#     if not sub:
#         return jsonify({"error": "subcategory not found"}), 404

#     r = db.recipes.find_one({"slug": recipe_slug, "subcategory_id": sub["_id"]})
#     if not r:
#         return jsonify({"error": "recipe not found"}), 404
#     return jsonify(object_id_str(r))

# # ---------- List / Filter Recipes ----------
# def list_recipes():
#     db = current_app.db
#     query = {"category": "Recipes"}

#     qtext = request.args.get("q")
#     if qtext:
#         query["$or"] = [
#             {"title": {"$regex": qtext, "$options": "i"}},
#             {"tags": {"$regex": qtext, "$options": "i"}}
#         ]

#     sub_slug = request.args.get("subcategory")
#     if sub_slug:
#         sub = db.subcategories.find_one({"slug": sub_slug})
#         if sub:
#             query["subcategory_id"] = sub["_id"]

#     recipes = list(db.recipes.find(query).sort("created_at", -1))
#     return jsonify([object_id_str(r) for r in recipes])

# # ---------- Update Recipe ----------
# def update_recipe(id):
#     db = current_app.db
#     try:
#         recipe = db.recipes.find_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "invalid id"}), 400
#     if not recipe:
#         return jsonify({"error": "not found"}), 404

#     data = request.form if request.form else request.json
#     update = {}

#     if data.get("title"):
#         update["title"] = data.get("title").strip()
#         update["slug"] = slugify(data.get("title"))

#     if data.get("subcategory_id"):
#         parent_sub = db.subcategories.find_one({"_id": ObjectId(data.get("subcategory_id"))})
#         if parent_sub:
#             update["subcategory"] = parent_sub["name"]
#             update["subcategory_id"] = parent_sub["_id"]
#             update["category_id"] = parent_sub["category_id"]
#             update["subcategory_slug"] = slugify(parent_sub["name"])

#     for key in ["ingredients", "steps", "tags"]:
#         val = parse_list(data, key)
#         if val is not None:
#             update[key] = val

#     existing = data.get("existingImages")
#     if existing:
#         try:
#             update["images"] = json.loads(existing)
#         except:
#             update["images"] = existing.split(",")
#     else:
#         update["images"] = recipe.get("images", [])

#     update["images"] += save_images(request.files)
#     update["updated_at"] = datetime.datetime.utcnow()
#     db.recipes.update_one({"_id": ObjectId(id)}, {"$set": update})
#     return jsonify({"message": "updated"})

# # ---------- Delete Recipe ----------
# def delete_recipe(id):
#     db = current_app.db
#     try:
#         db.recipes.delete_one({"_id": ObjectId(id)})
#     except InvalidId:
#         return jsonify({"error": "invalid id"}), 400
#     return jsonify({"message": "deleted"})
