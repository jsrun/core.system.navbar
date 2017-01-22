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

webide.module("navbar", function(){
    this.navbar = {
        clicked: false,
        
        bind: function(){
            $(".wi-window-modal").click(function(){
                webide.navbar.clicked = false;
                $(".wi-navbar").removeClass("wi-navbar-clicked");
            });

            $(".wi-navbar-item").click(function(e){
                e.preventDefault();
                e.stopPropagation();

                webide.navbar.clicked = !webide.navbar.clicked;

                if(webide.navbar.clicked){
                    $(".wi-navbar").addClass("wi-navbar-clicked");
                    $(this).addClass("wi-navbar-item-selected");
                }
                else{
                    $(".wi-navbar").removeClass("wi-navbar-clicked");
                    $(this).removeClass("wi-navbar-item-selected");
                }

                $(".wi-btn-menu-active").removeClass("wi-btn-menu-active");
            });

            $(".wi-navbar-item").mouseover(function(e){
                if(webide.navbar.clicked){
                    $(".wi-navbar-item-selected").removeClass("wi-navbar-item-selected");
                    $(this).addClass("wi-navbar-item-selected");
                }
            });

            $("body").click(function(){
                webide.navbar.clicked = false;
                $(".wi-navbar-clicked").removeClass("wi-navbar-clicked");
                $(".wi-navbar-item-selected").removeClass("wi-navbar-item-selected");
            });
        }
    };   
    
    this.navbar.bind();    
});