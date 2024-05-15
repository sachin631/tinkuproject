class apiFeatures {
    constructor(query,queryStr){  //her query means api or productModel.find() and queryStr means keyword or query params
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyWord=this.queryStr.keyWord
        ?{
            
                name:{
                    $regex:this.queryStr.keyWord,
                    $options:"i"  //i means remove cash sensitivity
                }
            
        }:{}
        console.log(keyWord)
        this.query=this.query.find({...keyWord})
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};

        //removing some fiels for category
        const removeFields=["keyWord","page","limit"];

        removeFields.forEach((key)=>delete queryCopy[key]);
//show all product if we keep category empty
        if (!queryCopy.category) {
            delete queryCopy.category; // Remove the category field from the query
        }

        //filter for price and rating
        // console.log(queryCopy)
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)


        this.query=this.query.find(JSON.parse(queryStr));
        // console.log(queryStr)
        return this;
    }

    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page ) ||1;
        const skip=resultPerPage*(currentPage-1);

        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;

    }

}

module.exports=apiFeatures