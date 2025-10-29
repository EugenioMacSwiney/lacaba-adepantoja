class SocialMediaIntegration {
    constructor() {
        this.facebookPage = 'LaCabañaDePantoja';
        this.instagramUser = 'lacabanadepantoja';
        this.init();
    }

    init() {
        this.loadFacebookSDK();
        this.createSocialButtons();
        this.setupAutoPosting();
    }

  
    loadFacebookSDK() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: 'tu-app-id-facebook',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v18.0'
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/es_LA/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }


    createSocialButtons() {
        const socialSection = document.createElement('section');
        socialSection.id = 'social-media';
        socialSection.className = 'py-12 bg-surface';
        socialSection.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                        Síguenos en Redes Sociales
                    </h2>
                    <p class="text-secondary text-lg">Mantente al día con nuestras promociones y eventos especiales</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <!-- Facebook -->
                    <div class="bg-white p-6 rounded-lg restaurant-shadow text-center">
                        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Facebook</h3>
                        <p class="text-gray-600 mb-4">Síguenos para ver nuestras promociones y eventos</p>
                        <a href="https://facebook.com/${this.facebookPage}" target="_blank" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Seguir en Facebook
                        </a>
                    </div>

                    <!-- Instagram -->
                    <div class="bg-white p-6 rounded-lg restaurant-shadow text-center">
                        <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.806 3.73 13.655 3.73 12.358s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Instagram</h3>
                        <p class="text-gray-600 mb-4">Mira nuestras fotos y videos más recientes</p>
                        <a href="https://instagram.com/${this.instagramUser}" target="_blank" class="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors">
                            Seguir en Instagram
                        </a>
                    </div>
                </div>

                <!-- Feed de Instagram (Placeholder) -->
                <div class="mt-12 text-center">
                    <h3 class="text-2xl font-bold text-primary mb-6">Últimas Publicaciones</h3>
                    <div id="instagram-feed" class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div class="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                            <span class="text-gray-500">Cargando Instagram...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;


        const testimonialsSection = document.getElementById('testimonials');
        if (testimonialsSection) {
            testimonialsSection.parentNode.insertBefore(socialSection, testimonialsSection.nextSibling);
        }
    }


    setupAutoPosting() {

        console.log('Sistema de publicación automática inicializado');
        
    
        this.simulateAutoPost();
    }

    simulateAutoPost() {

        document.addEventListener('reservationCreated', (event) => {
            this.postToSocialMedia(`Nueva reserva confirmada para ${event.detail.date} a las ${event.detail.time}`);
        });
    }


    postToSocialMedia(message) {
 
        console.log('Publicando en redes sociales:', message);
        
    
        this.postToFacebook(message);
        

        this.postToInstagram(message);
    }

    postToFacebook(message) {

        if (typeof FB !== 'undefined') {
            FB.ui({
                method: 'share',
                href: window.location.href,
                quote: message,
            }, function(response){});
        }
    }

    postToInstagram(message) {

        const instagramUrl = `https://www.instagram.com/create/story?text=${encodeURIComponent(message)}`;
        console.log('Redirigiendo a Instagram:', instagramUrl);
    }

 
    shareOnFacebook(content) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareOnInstagram() {

        alert('Para compartir en Instagram, toma una captura de pantalla y compártela en tu historia!');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const socialMedia = new SocialMediaIntegration();
    

    document.querySelectorAll('.menu-item').forEach(item => {
        const shareButton = document.createElement('button');
        shareButton.className = 'mt-2 text-primary hover:text-accent transition-colors text-sm flex items-center';
        shareButton.innerHTML = `
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            Compartir
        `;
        
        shareButton.addEventListener('click', function() {
            const dishName = item.querySelector('h4').textContent;
            const dishDescription = item.querySelector('p').textContent;
            const shareText = `¡Mira este delicioso ${dishName} de La Cabaña de Pantoja! ${dishDescription}`;
            
            socialMedia.shareOnFacebook(shareText);
        });
        
        item.querySelector('.flex-1').appendChild(shareButton);
    });
});