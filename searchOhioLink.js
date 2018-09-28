// this script requires jquery
// creates the "search ohiolink" link for EDS searches with no results

var search_terms = [];
var url = "";

var search_types = {
    "AU":"a",
    "TI":"t",
    "SU":"d",
    "IS":"i",
    "IB":"i",
    "IS ISSN":"i",
    "IB ISBN":"i",
    "TI Title":"t",
    "AU Author":"a",
    "SU Subject Terms":"d",
};

function findTerms(selectors){
    selectors.forEach(function(selector){
        if(selector.string !== ""){
            if(selector.string.substring(0,2) in search_types){
                var search_type = selector.string.substring(0,2);
            } else {
                var search_type = selector.type;
            }
            search_terms.push({
                "string":selector.string,
                "type":search_type,
                "operator":selector.operator
            });
        }
    })
}

function reassignSearchType(type){
    if (type in search_types){
        return search_types[type];
    } else {
        return "X";
    }   
}

function cleanUpSearchString(string){
    if(string.substring(0,2) in search_types) {
        return string.slice(3);
    } else {
        return string;
    }
}

$(document).ready(function(){

    var jquerySelectors= [
        {string : $("#Searchbox1").val(), type:$(".dd-active").first().attr("title"), operator:$("#guidedfindfieldRows > li.field-row:nth-child(2)").find(".dd-active").attr("title")},
        {string : $("#Searchbox2").val(), type:$("#guidedfindfieldRows > li.field-row:nth-child(2)").find(".dd-active:nth-child(1)").attr("title"), operator:$("#guidedfindfieldRows > li.field-row:nth-child(3)").find(".dd-active").attr("title")},
        {string : $("#Searchbox3").val(), type:$("#guidedfindfieldRows > li.field-row:nth-child(3)").find(".dd-active:nth-child(1)").attr("title"), operator:""},
    ];

    findTerms(jquerySelectors);
    
    search_terms.forEach(function(search){
        search.type = reassignSearchType(search.type);
        search.string = cleanUpSearchString(search.string);
    }) 

    if(search_terms.length == 1){
        var url = "http://olc1.ohiolink.edu/search/" + search_terms[0].type + "?SEARCH=" + search_terms[0].string;
    } else {
        var url = "http://olc1.ohiolink.edu/search/X?SEARCH=";
        search_terms.forEach(function(search){
            url += search.type + ":(" + search.string + ")%20" + search.operator + "%20" 
        });
        url = url.slice(0, -9);
        console.log(url);
    }

    $(".std-warning-text").html("<p>No results found. Go to <a href='" + url + "'>OhioLINK</a> to expand your search.");

})

