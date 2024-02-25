let http=require('http');
let fs=require('fs');
let url=require('url');
let path=require('path');

http.createServer((req,res)=>{

    let path=url.parse(req.url,true);
    if(req.url=='/todo.html'){
        let todo=fs.readFileSync('./todo.html');
        res.setHeader('Content-Type','text/html');
        res.end(todo);
    }
    else if(req.url=='/addTask'){
        let taskarray=JSON.parse(fs.readFileSync('./todo.json','utf-8'));
        let taskdata='';
        req.on('data',(chunk)=>{
            taskdata+=chunk;
        })
        req.on('end',()=>{
            taskarray.push(JSON.parse(taskdata));
            fs.writeFileSync('./todo.json',JSON.stringify(taskarray));
        })
        res.end('data added successfully');
    }
    else if(path.pathname=='/tasks'){
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    
        res.statusCode=202;
        res.statusMessage='ok';
        let data=fs.readFileSync('./todo.json','utf-8');
        let task=JSON.parse(data);
        let result=task.filter(tasks=>{
            return tasks.status.toUpperCase()==path.query.status.toUpperCase()
        })

        res.write(JSON.stringify(result));
        res.end();
    }
    else{
        res.setHeader('Content-Type','text/plain');
        res.statusCode=404;
        res.statusMessage = 'Not found';
        res.end();
    }

}).listen(3030);