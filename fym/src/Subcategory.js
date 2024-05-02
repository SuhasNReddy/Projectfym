const Subcategory = ({subcategories,category,handleSelectedSub}) => {
    return ( 
        <div className="Subcategory">
            {
                subcategories.map(subcat=>(
                    <span 
                    key={`s ${subcat}`}
                    >
                        <input
                            value={`${category},${subcat}`}
                            type="checkbox"
                            name={`${category},${subcat}`}
                            id={subcat}
                            onClick={(e)=>{
                                handleSelectedSub(e.target.value)
                            }}
                        />
                        <label htmlFor={subcat} style={{ color: 'black' }}>
                            {subcat}
                        </label>
                    </span>
                ))
            }
        </div>
     );
}
 
export default Subcategory;