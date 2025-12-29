/**
 * ============================================
 * LANDING PAGE - SCRIPT PRINCIPAL
 * ============================================
 * Funcionalidades:
 * - Navegación suave y menú móvil
 * - Animaciones al scroll
 * - Efectos de navbar al hacer scroll
 * - Manejo del formulario de contacto
 * - Smooth scrolling mejorado
 */

(function() {
    'use strict';

    // ============================================
    // VARIABLES GLOBALES
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // ============================================
    // NAVEGACIÓN Y MENÚ MÓVIL
    // ============================================
    
    /**
     * Toggle del menú móvil
     */
    function initMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer clic en un enlace
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navbar.contains(event.target);
                if (!isClickInsideNav && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    /**
     * Navegación suave mejorada
     */
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Solo aplicar smooth scroll a enlaces internos
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80; // Altura del navbar
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ============================================
    // EFECTOS DE SCROLL
    // ============================================
    
    /**
     * Efecto de navbar al hacer scroll
     */
    function initNavbarScroll() {
        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (navbar) {
                if (currentScroll > scrollThreshold) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Animaciones al hacer scroll (Intersection Observer)
     */
    function initScrollAnimations() {
        // Opciones para el Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // Callback del observer
        const observerCallback = function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Opcional: dejar de observar después de animar
                    // observer.unobserve(entry.target);
                }
            });
        };

        // Crear el observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Elementos a animar
        const elementsToAnimate = document.querySelectorAll(`
            .benefit-card,
            .value-item,
            .about-text,
            .about-visual,
            .visual-item
        `);

        // Aplicar clase fade-in y observar
        elementsToAnimate.forEach((element, index) => {
            element.classList.add('fade-in');
            // Añadir delay progresivo para efecto cascada
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    }

    /**
     * Animación de contadores en las estadísticas del hero
     */
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = function(element) {
            const target = element.textContent;
            const isNumber = target.match(/\d+/);
            
            if (!isNumber) return;
            
            const number = parseInt(isNumber[0]);
            const suffix = target.replace(/\d+/, '');
            const duration = 2000; // 2 segundos
            const increment = number / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = function() {
                current += increment;
                if (current < number) {
                    element.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };
            
            // Iniciar animación cuando el elemento sea visible
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        };
        
        statNumbers.forEach(animateCounter);
    }

    // ============================================
    // FORMULARIO DE CONTACTO
    // ============================================
    
    /**
     * Manejo del formulario de contacto
     */
    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = document.getElementById('email');
                const email = emailInput.value.trim();
                
                // Validación básica
                if (!validateEmail(email)) {
                    showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
                    return;
                }
                
                // Simular envío (en producción, aquí iría la llamada al servidor)
                showFormMessage('¡Gracias! Te contactaremos pronto.', 'success');
                emailInput.value = '';
                
                // Opcional: aquí podrías hacer una petición fetch a un endpoint
                // fetch('/api/contact', { method: 'POST', body: JSON.stringify({ email }) })
            });
        }
    }

    /**
     * Validar formato de email
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Mostrar mensaje en el formulario
     */
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            
            // Limpiar mensaje después de 5 segundos
            setTimeout(function() {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }

    // ============================================
    // EFECTOS ADICIONALES
    // ============================================
    
    /**
     * Efecto parallax sutil en el hero
     */
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    /**
     * Efecto hover mejorado en las tarjetas
     */
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.benefit-card, .value-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    /**
     * Lazy loading para imágenes (si se añaden en el futuro)
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // OPTIMIZACIONES DE RENDIMIENTO
    // ============================================
    
    /**
     * Throttle para eventos de scroll (mejor rendimiento)
     */
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Debounce para eventos de resize
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
    /**
     * Inicializar todas las funcionalidades cuando el DOM esté listo
     */
    function init() {
        // Navegación
        initMobileMenu();
        initSmoothScroll();
        initNavbarScroll();
        
        // Animaciones
        initScrollAnimations();
        initCounterAnimation();
        
        // Formulario
        initContactForm();
        
        // Efectos adicionales
        initCardHoverEffects();
        initLazyLoading();
        
        // Optimizaciones
        // Aplicar throttle a eventos de scroll si es necesario
        window.addEventListener('scroll', throttle(function() {
            // Eventos de scroll optimizados ya están en sus funciones
        }, 16)); // ~60fps
        
        console.log('✅ Landing page inicializada correctamente');
    }

    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM ya está listo
        init();
    }

    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', debounce(function() {
        // Cerrar menú móvil si está abierto al redimensionar
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        }
    }, 250));

})();

