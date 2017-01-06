/**
 * Core navbar module
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

let SystemException = require("../core.plugins.exception.js");

module.exports = {
    /**
     * List of navbar itens
     * @type object
     */
    itens: {"File": {}, "Edit": {}},
    
    /**
     * List module assets
     * @type object
     */
    assets: {
        css: [__dirname + "/core.system.navbar.style.css"],
        js: [__dirname + "/core.system.navbar.events.js"]
    },
    
    /**
     * Function to add item menu
     * 
     * @params object item
     * @return this
     */ 
    addItem: function(path, item, index){
        if(typeof item == "object" && typeof path == "string")
            this.itens[path] = item;
        else
            throw new SystemException("The default value for navbar item is 'object' and path is 'string'.");
    },
    
    /**
     * Funcion to create navbar
     * 
     * @param object webide
     * @return object
     */
    createNavbar: function(webide){
        let navbar = {};
        
        for(let key in this.itens){
            let mapTree = key.split("/");
            
            for(let keyMapTree in mapTree){                
                switch(parseInt(keyMapTree)){
                    case 0:
                        if(typeof navbar[mapTree[0]] !== "object")
                            navbar[mapTree[0]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 1){
                            let command = webide.commands.get(this.itens[key].command);
                            
                            if(command)
                                navbar[mapTree[0]].shortcut = command.bind.win;
                            
                            navbar[mapTree[0]].icon = this.itens[key].icon;
                        }
                    break;
                    case 1:
                        if(typeof navbar[mapTree[0]].itens[mapTree[1]] !== "object")
                            navbar[mapTree[0]].itens[mapTree[1]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 2){
                            let command = webide.commands.get(this.itens[key].command);
                            
                            if(command)
                                if(command.bind)
                                    navbar[mapTree[0]].itens[mapTree[1]].shortcut = command.bind.win;
                            
                            navbar[mapTree[0]].itens[mapTree[1]].icon = this.itens[key].icon;
                            navbar[mapTree[0]].itens[mapTree[1]].divide = this.itens[key].divide;
                            navbar[mapTree[0]].itens[mapTree[1]].submenu = this.itens[key].submenu;
                            navbar[mapTree[0]].itens[mapTree[1]].checkbox = this.itens[key].checkbox;
                            navbar[mapTree[0]].itens[mapTree[1]].class = this.itens[key].class;
                            navbar[mapTree[0]].itens[mapTree[1]].onclick = this.itens[key].onclick;
                        }
                    break;
                }
            }
        }

        return navbar;
    },
    
    /**
     * Function to generate template
     * 
     * @param object webide
     * @return string
     */
    getTemplate: function(webide){
        let fs = require("fs"), ejs = require("ejs"); 
        return ejs.render(fs.readFileSync(__dirname + "/core.system.navbar.tpl.ejs").toString(), {itens: this.createNavbar(webide)});
    }
}