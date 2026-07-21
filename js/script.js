document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.body.classList.add("is-loading");

    /*
     * Lenis smooth scrolling
     */
    let lenis;

    if (!prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    /*
     * Loading animation
     */
    const loaderTimeline = gsap.timeline({
        onComplete: () => {
            document.body.classList.remove("is-loading");
            document.querySelector(".loader").remove();

            ScrollTrigger.refresh();
        }
    });

    if (prefersReducedMotion) {
        loaderTimeline
            .set(".loader", { display: "none" })
            .call(() => {
                document.body.classList.remove("is-loading");
                document.querySelector(".loader")?.remove();
            });
    } else {
        loaderTimeline
            .to(".loader__line span", {
                scaleX: 1,
                duration: 3,
                ease: "power2.inOut"
            })
            .to(".loader__label", {
                opacity: 0,
                y: -10,
                duration: 0.4
            })
            .to(
                ".loader h1",
                {
                    opacity: 0,
                    y: -30,
                    duration: 0.6,
                    ease: "power3.in"
                },
                "<"
            )
            .to(".loader", {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut"
            })
            .from(
                ".navbar",
                {
                    y: -100,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                },
                "-=0.35"
            );
    }

    /*
     * Create animations for each presentation panel
     */
    const panels = gsap.utils.toArray(".panel");

    panels.forEach((panel, index) => {
        const image = panel.querySelector(".panel__image");
        const titleLines = panel.querySelectorAll(".title-line > span");
        const revealItems = panel.querySelectorAll(".reveal-text");
        const number = panel.querySelector(".panel__number");

        if (prefersReducedMotion) {
            gsap.set(titleLines, { yPercent: 0 });
            gsap.set(revealItems, {
                opacity: 1,
                y: 0
            });

            return;
        }

        /*
         * Text entrance animation
         */
        const contentTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: panel,
        start: index === 0 ? "top 80%" : "top 65%",
        once: true
            }
        });

        contentTimeline
            .to(titleLines, {
                yPercent: -110,
                duration: 0
            })
            .to(titleLines, {
                yPercent: 0,
                duration: 1.2,
                stagger: 0.3,
                ease: "power4.out"
            })
            .to(
                revealItems,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.14,
                    ease: "power3.out"
                },
                "-=0.75"
            );

        /*
         * Image zoom and parallax
         */
        gsap.fromTo(
            image,
            {
                scale: 1.12,
                yPercent: -4
            },
            {
                scale: 1.02,
                yPercent: 4,
                ease: "none",

                scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2
                }
            }
        );

        /*
         * Section number movement
         */
        gsap.fromTo(
            number,
            {
                yPercent: 30,
                opacity: 0
            },
            {
                yPercent: -15,
                opacity: 1,
                ease: "none",

                scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );

        /*
         * Fade content while leaving section
         */
        gsap.to(panel.querySelector(".panel__content"), {
            opacity: 0,
            y: -80,
            ease: "none",

            scrollTrigger: {
                trigger: panel,
                start: "65% top",
                end: "bottom top",
                scrub: true
            }
        });
    });

    /*
     * Smooth navigation links
     */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetSelector = link.getAttribute("href");
            const target = document.querySelector(targetSelector);

            if (!target) {
                return;
            }

            event.preventDefault();

            if (lenis) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.5
                });
            } else {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }

            closeMobileMenu();
        });
    });

    /*
     * Mobile navigation
     */
    const menuButton = document.querySelector(".menu-button");
    const navigation = document.querySelector(".navbar nav");

    function closeMobileMenu() {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    /*
     * Refresh ScrollTrigger after all images load
     */
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    window.addEventListener("resize", () => {
        closeMobileMenu();
        ScrollTrigger.refresh();
    });





    
/*
 * Full-width story carousel
 */
const storyCarouselElement = document.querySelector(".story-swiper");

if (storyCarouselElement) {
    const progressBar = document.querySelector(
        ".story-carousel__progress-bar"
    );

    function animateStorySlide(slide) {
        if (!slide) {
            return;
        }

        const image = slide.querySelector(".story-slide__image");
        const eyebrow = slide.querySelector(".story-slide__eyebrow");
        const title = slide.querySelector(".story-slide__title");
        const description = slide.querySelector(
            ".story-slide__description"
        );
        const number = slide.querySelector(".story-slide__number");

        gsap.killTweensOf([
            image,
            eyebrow,
            title,
            description,
            number
        ]);

        const slideTimeline = gsap.timeline();

        slideTimeline
            .fromTo(
                image,
                {
                    scale: 1.16
                },
                {
                    scale: 1.04,
                    duration: 2.4,
                    ease: "power2.out"
                }
            )
            .fromTo(
                eyebrow,
                {
                    opacity: 0,
                    y: 35
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                },
                "-=1.9"
            )
            .fromTo(
                title,
                {
                    opacity: 0,
                    y: 80
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "power4.out"
                },
                "-=1.65"
            )
            .fromTo(
                description,
                {
                    opacity: 0,
                    y: 45
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.25,
                    ease: "power3.out"
                },
                "-=0.95"
            )
            .fromTo(
                number,
                {
                    opacity: 0,
                    y: 35
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                },
                "-=1"
            );
    }

    function resetInactiveStorySlides(swiper) {
        swiper.slides.forEach((slide, index) => {
            if (index === swiper.activeIndex) {
                return;
            }

            gsap.set(
                slide.querySelector(".story-slide__eyebrow"),
                {
                    opacity: 0,
                    y: 35
                }
            );

            gsap.set(
                slide.querySelector(".story-slide__title"),
                {
                    opacity: 0,
                    y: 80
                }
            );

            gsap.set(
                slide.querySelector(".story-slide__description"),
                {
                    opacity: 0,
                    y: 45
                }
            );

            gsap.set(
                slide.querySelector(".story-slide__number"),
                {
                    opacity: 0,
                    y: 35
                }
            );

            gsap.set(
                slide.querySelector(".story-slide__image"),
                {
                    scale: 1.16
                }
            );
        });
    }

    const storyCarousel = new Swiper(".story-swiper", {
        slidesPerView: 1,
        speed: 1100,
        loop: false,
        grabCursor: true,
        keyboard: {
            enabled: true
        },
        navigation: {
            nextEl: ".story-arrow--next",
            prevEl: ".story-arrow--previous"
        },
        pagination: {
            el: ".story-carousel__pagination",
            type: "fraction",
            formatFractionCurrent(number) {
                return String(number).padStart(2, "0");
            },
            formatFractionTotal(number) {
                return String(number).padStart(2, "0");
            }
        },
        effect: "slide",
        on: {
            init(swiper) {
                resetInactiveStorySlides(swiper);

                animateStorySlide(
                    swiper.slides[swiper.activeIndex]
                );

                gsap.set(progressBar, {
                    scaleX: 1 / swiper.slides.length
                });
            },

            slideChangeTransitionStart(swiper) {
                resetInactiveStorySlides(swiper);

                const progress =
                    (swiper.activeIndex + 1) /
                    swiper.slides.length;

                gsap.to(progressBar, {
                    scaleX: progress,
                    duration: 1,
                    ease: "power3.inOut"
                });
            },

            slideChangeTransitionEnd(swiper) {
                animateStorySlide(
                    swiper.slides[swiper.activeIndex]
                );
            }
        }
    });
}







// begin presentation

/*
 * Split presentation section
 */


/*
 * Animate every split presentation section
 */
const splitSections = document.querySelectorAll(
    ".split-presentation"
);

splitSections.forEach((splitSection) => {
    const eyebrow = splitSection.querySelector(
        ".split-presentation__eyebrow"
    );

    const title = splitSection.querySelector(
        ".split-presentation__title"
    );

    const lead = splitSection.querySelector(
        ".split-presentation__lead"
    );

    const text = splitSection.querySelector(
        ".split-presentation__text"
    );

    const facts = splitSection.querySelectorAll(
        ".split-fact"
    );

    const imageWrapper = splitSection.querySelector(
        ".split-presentation__image-wrapper"
    );

    const image = splitSection.querySelector(
        ".split-presentation__image"
    );

    const isImageLeft = splitSection.classList.contains(
        "split-presentation--image-left"
    );

    /*
     * Set the starting position before animation.
     */
    gsap.set(imageWrapper, {
        opacity: 0,
        x: isImageLeft ? -100 : 100,
        scale: 0.94
    });

    const splitTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: splitSection,
            start: "top 68%",
            once: true
        }
    });

    splitTimeline
        .to(imageWrapper, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.8,
            ease: "power4.out"
        })
        .to(
            eyebrow,
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out"
            },
            "-=1.35"
        )
        .to(
            title,
            {
                opacity: 1,
                y: 0,
                duration: 1.7,
                ease: "power4.out"
            },
            "-=1.1"
        )
        .to(
            lead,
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "power3.out"
            },
            "-=0.85"
        )
        .to(
            text,
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            },
            "-=0.7"
        )
        .to(
            facts,
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.14,
                ease: "power3.out"
            },
            "-=0.55"
        );

    /*
     * Image parallax while scrolling.
     */
    gsap.fromTo(
        image,
        {
            yPercent: -5,
            scale: 1.08
        },
        {
            yPercent: 5,
            scale: 1.02,
            ease: "none",

            scrollTrigger: {
                trigger: splitSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2
            }
        }
    );
});


// end presentation




});






const chapter = document.querySelector(".chapter-break");

if (chapter) {

    gsap.timeline({

        scrollTrigger:{
            trigger:chapter,
            start:"top center",
            once:true
        }

    })

    .fromTo(

        ".chapter-break__eyebrow",

        {
            opacity:0,
            y:30
        },

        {
            opacity:1,
            y:0,
            duration:1
        }

    )

    .fromTo(

        ".chapter-break__title",

        {
            opacity:0,
            y:80
        },

        {
            opacity:1,
            y:0,
            duration:2,
            ease:"power4.out"
        },

        "-=.5"

    )

    .fromTo(

        ".chapter-break__subtitle",

        {
            opacity:0,
            y:40
        },

        {
            opacity:1,
            y:0,
            duration:1.4
        },

        "-=1"

    )

    .fromTo(

        ".chapter-break__scroll",

        {
            opacity:0
        },

        {
            opacity:1,
            duration:1
        },

        "-=.6"

    );
}