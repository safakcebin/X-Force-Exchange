const express = require('express')
const bodyParser = require('body-parser')
const xfe = require("xfe");
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

async function getThreatExhcangDate(domain){

    var xfeClient = new xfe("9d34bf79-ba8e-4b2a-8367-7e5bf67502c0", "384d6ce0-3a4c-4d4b-9a2b-864eec3e176b");

    var response = await xfeClient.url.get(domain);
    var list = JSON.parse(response);
    console.log(list.result);

    return list.result;
    
 }
app.post('/postdata', async (request, response) => {
    var body=request.body
    var domain=body.domain;
    var apiResponseObj= await getThreatExhcangDate(domain)

    var urlHtml="";
    var scoreHtml="";
    var catsHtml="";
    var catsDescriptionsHtml="";

    urlHtml+="<tr><td>Url</td><td>"+ apiResponseObj.url+"</td></tr>";
    scoreHtml+="<tr><td>Score</td><td>"+ apiResponseObj.score+"</td></tr>";

    catsHtml+="<tr><td colspan='2' class='title'>Categories</td></tr>";
    Object.keys(apiResponseObj.cats).forEach(key => {
        var value=apiResponseObj.cats[key];
        catsHtml+="<tr><td>"+key+"</td><td>"+value+"</td></tr>";

     });
     catsDescriptionsHtml+="<tr><td colspan='2' class='title'>Category Descriptions</td></tr>";
     Object.keys(apiResponseObj.categoryDescriptions).forEach(key => {
        var value=apiResponseObj.categoryDescriptions[key];
        catsDescriptionsHtml+="<tr><td>"+key+"</td><td>"+value+"</td></tr>";

     });
    response.send(`
    <!doctype html>
    <head>
        <style>
            table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
            }
            .title{
                background-color:#AAAAAA;
            }
        </style>
    </head>
    <html>
    <body>
       <table width="100%">
       <tr class='title'><th >Name</th><th>Value</th></tr>`
       +urlHtml+scoreHtml+catsHtml+catsDescriptionsHtml+
       `</table>
    </body>
    </html>
`);

});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
