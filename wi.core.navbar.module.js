/**
 * Core navbar module
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

let _ = require("lodash"),
    SystemException = require("../core.plugins.exception.js"),
    TemplateEngine = require("../core.plugins.template.js");

module.exports = {
    /**
     * List of navbar itens
     * @type object
     */
    itens: {},
    
    /**
     * List of widgets to navbar
     * @type object
     */
    widgets: {},
    
    /**
     * List module assets
     * @type object
     */
    assets: {
        css: [__dirname + "/wi.core.navbar.style.css"],
        js: [__dirname + "/wi.core.navbar.events.js"]
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
     * @param object _this
     * @return object
     */
    createNavbar: function(_this){
        let navbar = {};
        
        for(let key in this.itens){
            let mapTree = key.split("/");
            
            for(let keyMapTree in mapTree){                
                switch(parseInt(keyMapTree)){
                    case 0:
                        if(typeof navbar[mapTree[0]] !== "object")
                            navbar[mapTree[0]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 1){
                            let command = _this.commands.get(this.itens[key].command);
                            
                            if(command)
                                navbar[mapTree[0]].shortcut = command.bind.win;
                            
                            navbar[mapTree[0]].icon = this.itens[key].icon;
                        }
                    break;
                    case 1:
                        if(typeof navbar[mapTree[0]].itens[mapTree[1]] !== "object")
                            navbar[mapTree[0]].itens[mapTree[1]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 2){
                            let command = _this.commands.get(this.itens[key].command);
                            
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
     * Function to add widget
     * 
     * @param object item
     * @return void
     */
    addWidget: function(item){
        if(typeof item == "object"){
            this.widgets[item.id] = item;
            
            if(typeof item.css == "object")
                this.assets.css = _.concat(this.assets.css, item.css);
            
            if(typeof item.js == "object")
                this.assets.js = _.concat(this.assets.js, item.js);
        }
        else{
            throw new SystemException("The default value for navbar widgets is 'object'.");
        }
    },
    
    /**
     * Function to generate template
     * 
     * @param object _this
     * @return string
     */
    getTemplate: function(_this){
        return TemplateEngine(__dirname + "/wi.core.navbar.tpl.ejs").seti18n(_this.i18n).render({itens: this.createNavbar(_this), widgets: this.widgets});
    }
}