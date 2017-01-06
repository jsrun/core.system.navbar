/**
 * Frontend navbar events
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @license MIT
 */

(function(){
    webide.navbar = {clicked: false};    
    var itens = document.querySelectorAll(".wi-navbar-item");
    
    document.querySelector(".wi-window-modal").onclick = function(){
        webide.navbar.clicked = false;
        document.querySelector(".wi-navbar").className = document.querySelector(".wi-navbar").className.replace("wi-navbar-clicked", "");
    };
    
    for(var key in itens){
        itens[key].onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
                
            webide.navbar.clicked = !webide.navbar.clicked;
            
            if(webide.navbar.clicked){
                document.querySelector(".wi-navbar").className = document.querySelector(".wi-navbar").className + " wi-navbar-clicked";
                this.className = this.className + " wi-navbar-item-selected";
            }
            else{
                document.querySelector(".wi-navbar").className = document.querySelector(".wi-navbar").className.replace("wi-navbar-clicked", "");
                this.className = this.className.replace(" wi-navbar-item-selected", "");
            }
        }
        
        itens[key].onmouseover = function(){   
            if(webide.navbar.clicked){
                var _this = this;
                var itens = document.querySelectorAll(".wi-navbar-item");
                
                for(var key2 in itens)
                    if(typeof itens[key2].className == "string")
                        itens[key2].className = itens[key2].className.replace(" wi-navbar-item-selected", "");

                this.className = this.className + " wi-navbar-item-selected";      
            }
        }        
    }
})();