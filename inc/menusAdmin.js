module.exports = {
    getMenus(req){
        let menus =  [
            {
                text:"Tela Inicial",
                href:"/admin/",
                icon:"home",
                active: false
            },
            {
                text:"Usuários",
                href:"/admin/usuarios",
                icon:"users",
                active: false
            },
            {
                text:"Sugestões de Inscrição",
                href:"/admin/sugestoes",
                icon:"user-plus",
                active: false
            }
        ];

        menus.map(menu =>{

            console.log(menu.href, `/admin${req.url}`)

            if( menu.href === `/admin${req.url}`) menu.active = true;
        })

        return menus;
    }
};