(function () {
    let unityInstance = null;
    let interstitialAdsgram = null;
    let rewardedAdsgram = null;

    let onclickRewardedInitialized = false;
    let onclickRewardedShow = null;
    let onclickBannerDiv = null;


    let rewardedToggle = 0;

    window.AdsManager = {
        initialize: function (unity, adsgram) {
            if (!adsgram) {
                console.warn("Adsgram SDK not available");
                return;
            }

            unityInstance = unity;
            interstitialAdsgram = adsgram?.init({ blockId: "int-11287" });
            rewardedAdsgram = adsgram?.init({ blockId: "11286" });

            if (window.initCdTma) {
                window.initCdTma({ id: "6077920" })
                    .then(show => {
                        onclickRewardedInitialized = true;
                        onclickRewardedShow = show;
                    })
                    .catch(e => console.error("Onclick Rewarded init error:", e));
            }

            onclickBannerDiv = document.createElement("div");
            onclickBannerDiv.setAttribute("data-banner", "6079882");
            onclickBannerDiv.classList.add("onclick-banner");
            onclickBannerDiv.style.display = "none";
            document.body.appendChild(onclickBannerDiv);
    
        },

        showInterstitial: function (onClose, onError) {
            if (interstitialAdsgram) {
                interstitialAdsgram.show()
                    .then(() => onClose?.())
                    .catch(err => onError?.(err));
            } else {
                onError?.("Interstitial Adsgram not initialized");
            }
        },

        showReward: function (rewardData, onSuccess, onError) {
            const source = rewardedToggle % 2;

            if (source === 0) {
                // Adsgram
                console.log("Adsgram Reward");
                if (rewardedAdsgram) {
                    rewardedAdsgram.show()
                        .then(() => {
                            onSuccess?.(rewardData);
                            trackEventGA("reward_shown", "source", "adsgram");
                        })
                        .catch(err => onError?.(err));
                } else {
                    onError?.("Rewarded Adsgram not initialized");
                }
            } else if (source === 1) {
<<<<<<< HEAD
=======
                // RichAds
                console.log("RichAds Reward");
                if (window.TelegramAdsController) {
                    window.TelegramAdsController.triggerInterstitialVideo().then((result) => {
                        onSuccess?.(rewardData);
                        trackEventGA("reward_shown", "source", "richads");
                    }).catch((err) => {
                        onError?.(err);
                    });
                } else {
                    onError?.("TelegramAdsController not available");
                }
                
            } else if (source === 2) {
>>>>>>> aafd814be13b637e961d8db3eafd006d17daf316
                // Onclick
                console.log("Onclick Reward");
                if (onclickRewardedInitialized && onclickRewardedShow) {
                    onclickRewardedShow()
                        .then(() => {
                            onSuccess?.(rewardData);
                            trackEventGA("reward_shown", "source", "onclick");
                        })
                        .catch(err => onError?.(err));
                } else {
                    onError?.("Onclick Rewarded not ready");
                }
            }

            rewardedToggle++;
        },

        showBanner: function () {

            if (!onclickBannerDiv) {
                onclickBannerDiv = document.querySelector('[data-banner="6079882"]');
            }

            if (onclickBannerDiv) onclickBannerDiv.style.display = "flex";
        },

        hideBanner: function () {
            if (onclickBannerDiv) {
                onclickBannerDiv.style.display = "none";
            }
        },

        trackEventGA: function (eventName, paramName = null, paramValue = null) {
            if (typeof window.gtag !== "function") {
                console.warn("gtag is not defined");
                return;
            }

            if (paramName && paramValue) {
                const params = {};
                params[paramName] = paramValue;
                window.gtag('event', eventName, params);
            } else {
                window.gtag('event', eventName);
            }
        }
    };
})();