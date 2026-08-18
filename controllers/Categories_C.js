import Category from "../module/Categories.js";

async function getAllCategories(req, res){
    try{
        const categories = await Category.find();

        if(categories.length === 0){
            return res.status(404).json({message: 'No category found'});
        }
        res.status(200).json({categories: categories});
    }catch(err){
        res.status(500).json({message: "err in get all categories" , error:err});
    }
}

async function createCategory(req, res){
    try {
        const {name , numOfBooks} = req.body;

        const newCategory = await Category.create({
            name,
            ...(numOfBooks !== undefined && {numOfBooks})
        });

        if (!newCategory) {
            return res.status(400).json({message: 'Category not added'});
        }

        res.status(201).json({
            message: 'Category added successfully',
            category: newCategory
        });

    }catch(e){
        res.status(500).json({error: e.message});
    }
}

async function getCategoryById(req, res){
    try{
        const id = req.id;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(200).json({category});
    }catch(e){
        res.status(500).json({message: `server error in getting category ${e}`});
    }
}

async function updateCategory(req, res){
    try{
        const id = req.id;
        const {name, numOfBooks} = req.body;
        const updatedData = {
            ...(name !== undefined && {name}),
            ...(numOfBooks !== undefined && {numOfBooks})
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updatedData,
            {new: true, runValidators: true}
        );

        if (!updatedCategory) {
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    }catch(e){
        res.status(500).json({message: `Category not updated ${e}`});
    }
}

async function deleteCategory(req, res){
    try{
        const id = req.id;
        const deletedCategory = await Category.findByIdAndDelete(id, {});
        if (!deletedCategory) {
            return res.status(404).json({message: 'Category not found'});
        }
        res.status(200).json({
            message: 'Category deleted successfully',
            category: deletedCategory
        });
    }catch(e){
        res.status(500).json({message: `server error in deleteing category  err:${e}`});
    }
}

export {getAllCategories , createCategory , getCategoryById , updateCategory , deleteCategory};