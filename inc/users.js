var conn = require("./db")

module.exports = {

    render(req, res, error){
        res.render("admin/login", {
            body: req.body,
            error
        })
    },

    login(email, password){
        
        return new Promise((resolve, reject)=>{
            conn.query(`
            SELECT * FROM users WHERE email = ?
            `, [email],
            (err, results) => {
                if (err) {
                  reject(err)  
                }else{

                    if(!results.length > 0){
                        reject("Usuário ou senha incorretos.");
                    }else{
                        let row = results[0]
                        if(row.senha !== password){
                            reject("Usuário ou senha incorretos.");
                        }else{
                            resolve(row)
                        }
                    }
                }
            })
        })

    },

    getMenus(){
        return new Promise((resolve, reject)=>{
            conn.query(` 
                SELECT 
                    (SELECT COUNT(*) FROM administrativo.users WHERE ativo = 1 and lixo = 0) AS  qtAtivos,
                    (SELECT COUNT(*) FROM administrativo.users WHERE ativo = 0  and lixo = 0) AS qtSugestoes;`, (err, resuls)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(resuls)
                }
            })
        })
        
    },

    getUsers(){
        return new Promise((resolve, reject)=>{
            conn.query(" SELECT * FROM users WHERE ativo = 1 and lixo = 0;", (err, resuls)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(resuls)
                }
            })
        })

    },

    deleteUser(id){
        return new Promise((reject, resolve)=>{
            conn.query(`UPDATE users SET lixo = 1, ativo = 0 WHERE id = ?`, [id], 
            (err, resuls)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(resuls)
                }
            })
        })
        
    },

    saveUser(fields){
        return new Promise((reject, resolve)=>{
            conn.query(
                `INSERT INTO users (nome, email, senha, ativo, lixo)
                 VALUES (?, ?, ?, 1, 0)`, 
                [fields.name,
                 fields.email,
                 fields.password],
                 (err, results)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(results)
                    }
                 }
                 )
        })
    },

    saveSuggestion(fields){
        return new Promise((reject, resolve)=>{
            conn.query(
                `INSERT INTO users (nome, email, senha, ativo, lixo)
                 VALUES (?, ?, ?, 0, 0)`, 
                [fields.name,
                 fields.email,
                 fields.password],
                 (err, results)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(results)
                    }
                 }
                 )
        })
    },

    getSuggestions(){
        return new Promise((resolve, reject)=>{
            conn.query(" SELECT * FROM users WHERE ativo = 0 and lixo = 0;", (err, results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results)
                }
            })
        })

    },

    acceptSuggestion(id){
        return new Promise((reject, resolve)=>{
            conn.query(`UPDATE users SET ativo = 1, lixo = 0 WHERE id = ?`, [id], 
            (err, resuls)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(resuls)
                }
            })
        })
        
    }

    
}