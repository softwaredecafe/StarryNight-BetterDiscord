/**
 * @name StarryNight
 * @author Alexander(softwaredecafe)
 * @description Plugin BetterDiscord
 * @version 1.0.0
 */

module.exports = class StarryNight {
    start() {
        try {
            if (BdApi.Themes && BdApi.Themes.get) {
                const tieneClearVision = BdApi.Themes.get("ClearVision");
                if (!tieneClearVision && BdApi.UI && BdApi.UI.showAlert) {
                    BdApi.UI.showAlert("Tema Base Recomendado", "Recuerda activar ClearVision V7 para ver la transparencia y el fondo.");
                }
            }

            const css = `
                :root {
                    --sn-van-gogh: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg');
                    --background-image: var(--sn-van-gogh) !important;
                }
                #app-mount { background: var(--sn-van-gogh) center/cover no-repeat fixed !important; }
                .theme-dark {
                    --brand-experiment: #2d7dff !important; 
                    --brand-experiment-500: #2d7dff !important;
                    --brand-experiment-560: #2d7dff !important;
                    --brand-experiment-600: #1a5bcf !important;
                    --background-modifier-selected: rgba(45, 125, 255, 0.4) !important; 
                    --text-link: #2d7dff !important;
                }
                #app-mount::before, #app-mount::after {
                    content: ""; position: absolute; width: 150px; height: 2px;
                    background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
                    border-radius: 50%; transform: rotate(315deg); pointer-events: none; z-index: 1; opacity: 0;
                }
                #app-mount::before { top: 10%; right: 10%; animation: shootingStarAnim 5s linear infinite; }
                #app-mount::after { top: 30%; right: 40%; animation: shootingStarAnim 7s linear infinite; animation-delay: 2.5s; }
                @keyframes shootingStarAnim { 0% { transform: rotate(315deg) translateX(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: rotate(315deg) translateX(-1800px); opacity: 0; } }
                @keyframes twinkleJS1 { 0% { opacity: 0.1; } 100% { opacity: 1; filter: brightness(1.2); } }
                @keyframes twinkleJS2 { 0% { opacity: 0.3; } 100% { opacity: 1; filter: brightness(1.5); } }
                @keyframes twinkleJS3 { 0% { opacity: 0; } 100% { opacity: 0.8; } }
                @keyframes twinkleJS4 { 0% { opacity: 0.5; } 100% { opacity: 1; transform: scale(1.2); } }
            `;

            if (BdApi.DOM && BdApi.DOM.addStyle) {
                BdApi.DOM.addStyle("StarryNight-Styles", css);
            } else if (BdApi.injectCSS) {
                BdApi.injectCSS("StarryNight-Styles", css);
            }

            const appMount = document.getElementById("app-mount");
            if (!appMount) throw new Error("No se encontró el elemento #app-mount en el DOM.");

            this.container = document.createElement("div");
            this.container.id = "starry-night-js-container";
            this.container.style.position = "absolute";
            this.container.style.top = "0";
            this.container.style.left = "0";
            this.container.style.width = "100%";
            this.container.style.height = "100%";
            this.container.style.pointerEvents = "none";
            this.container.style.zIndex = "0"; 
            this.container.style.overflow = "hidden";

            appMount.insertBefore(this.container, appMount.firstChild);

            this.generateStars();

            this.resizeHandler = () => this.generateStars();
            window.addEventListener('resize', this.resizeHandler);

        } catch (error) {
            console.error("[StarryNight] Error crítico en start():", error);
        }
    }

    stop() {
        try {
            if (BdApi.DOM && BdApi.DOM.removeStyle) {
                BdApi.DOM.removeStyle("StarryNight-Styles");
            } else if (BdApi.clearCSS) {
                BdApi.clearCSS("StarryNight-Styles");
            }
            
            if (this.container) this.container.remove();
            if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
        } catch (error) {
            console.error("[StarryNight] Error al detener el plugin:", error);
        }
    }

    generateStars() {
        if (!this.container) return;
        this.container.innerHTML = ''; 

        const canvasSize = window.innerWidth * window.innerHeight;
        const starsFraction = Math.floor(canvasSize / 3500); 

        for (let i = 0; i < starsFraction; i++) {
            const size = Math.random() < 0.75 ? 1 : 2; 
            const star = document.createElement('div');

            star.style.position = 'absolute';
            star.style.left = `${this.random(0, 100)}%`;
            star.style.top = `${this.random(0, 100)}%`;
            star.style.opacity = this.random(0.5, 1).toFixed(2); 
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = '#FFFFFF'; 
            star.style.borderRadius = '50%';
            
            if (size === 2) star.style.boxShadow = '0 0 3px 0.5px rgba(255, 255, 255, 0.4)';

            if (Math.random() < 0.3) { 
                const duration = this.random(3, 8); 
                const delay = this.random(0, 10); 
                const animType = Math.floor(Math.random() * 4) + 1; 
                star.style.animation = `twinkleJS${animType} ${duration}s infinite alternate ease-in-out`;
                star.style.animationDelay = `${delay}s`;
            }

            this.container.appendChild(star);
        }
    }

    random(min, max) { return Math.random() * (max - min) + min; }
};