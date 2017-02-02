/**
 *  __          __  _    _____ _____  ______   _   _             _                
 *  \ \        / / | |  |_   _|  __ \|  ____| | \ | |           | |               
 *   \ \  /\  / /__| |__  | | | |  | | |__    |  \| | __ ___   _| |__   __ _ _ __ 
 *    \ \/  \/ / _ \ '_ \ | | | |  | |  __|   | . ` |/ _` \ \ / / '_ \ / _` | '__|
 *     \  /\  /  __/ |_) || |_| |__| | |____ _| |\  | (_| |\ V /| |_) | (_| | |   
 *      \/  \/ \___|_.__/_____|_____/|______(_)_| \_|\__,_| \_/ |_.__/ \__,_|_| 
 *                                                                            
 *  @author André Ferreira <andrehrf@gmail.com>
 *  @license MIT
 */

"use strict";

let _ = require("lodash");
    
_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });
                
        var newobj = {};
        
        for(var key in keys)
            newobj[keys[key]] = obj[keys[key]];
        
        return newobj;
    }
});

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
     * Function to add item menu
     * 
     * @params object item
     * @return this
     */ 
    addItem: function(path, item, index){
        item.path = path;
        item.index = index;
        
        if(index)
            path = index + "_" + path;
        
        if(typeof item == "object" && typeof path == "string")
            this.itens[path] = item;
        else
            throw new "The default value for navbar item is 'object' and path is 'string'.";
    },
    
    /**
     * Function to parse and convert Atom menu to WebIDE Navbar
     * 
     * @param object menuJSON
     * @return void
     */
    addAtomMenu: function(menuJSON){
        let _this = this;
        
        menuJSON.menu.forEach((item, index) => {
            let root = item.label;
            
            item.submenu.forEach((subitem, index) => {
                var path = root + "/"+ subitem.label;  
                
                for(let key in subitem.submenu){
                    subitem.submenu[key].display = subitem.submenu[key].label
                }
                
                _this.addItem(path, subitem);
            });
        });
    },
    
    /**
     * Funcion to create navbar
     * 
     * @param object _this
     * @return object
     */
    createNavbar: function(commands){
        let navbar = {};
        this.itens = _.sortKeysBy(this.itens, (value, key) => { return value.index; }); //Order by index
                
        for(let key in this.itens){
            let mapTree = this.itens[key].path.split("/");
            
            for(let keyMapTree in mapTree){                
                switch(parseInt(keyMapTree)){
                    case 0:
                        if(typeof navbar[mapTree[0]] !== "object")
                            navbar[mapTree[0]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 1){
                            let command = commands.get(this.itens[key].command);
                            
                            if(command)
                                navbar[mapTree[0]].shortcut = command.bind.win;
                            
                            navbar[mapTree[0]].icon = this.itens[key].icon;
                        }
                    break;
                    case 1:
                        if(typeof navbar[mapTree[0]].itens[mapTree[1]] !== "object")
                            navbar[mapTree[0]].itens[mapTree[1]] = {display: mapTree[keyMapTree], itens: {}};
                        
                        if(mapTree.length == 2){
                            let command = commands.get(this.itens[key].command);
                            
                            if(command)
                                if(command.bind)
                                    navbar[mapTree[0]].itens[mapTree[1]].shortcut = command.bind.win;
                            
                            navbar[mapTree[0]].itens[mapTree[1]].icon = this.itens[key].icon;
                            navbar[mapTree[0]].itens[mapTree[1]].divide = this.itens[key].divide;
                            navbar[mapTree[0]].itens[mapTree[1]].submenu = this.itens[key].submenu;
                            navbar[mapTree[0]].itens[mapTree[1]].checkbox = this.itens[key].checkbox;
                            navbar[mapTree[0]].itens[mapTree[1]].class = this.itens[key].class;
                            navbar[mapTree[0]].itens[mapTree[1]].onclick = this.itens[key].onclick;
                            navbar[mapTree[0]].itens[mapTree[1]].command = this.itens[key].command;
                            navbar[mapTree[0]].itens[mapTree[1]].disabled = this.itens[key].disabled;
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
            throw new "The default value for navbar widgets is 'object'.";
        }
    },
    
    /**
     * Function to generate template
     * 
     * @param object _this
     * @return string
     */
    getTemplate: function(commands, navbar, i18n, template){
        return new template(__dirname + "/template.ejs").seti18n(i18n).render({itens: navbar.createNavbar(commands), widgets: navbar.widgets});
    }
};