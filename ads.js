(function () {
    let unityInstance = null;
    let interstitialAdsgram = null;
    let rewardedAdsgram = null;

    let onclickRewardedInitialized = false;
    let onclickRewardedShow = null;
    let onclickBannerDiv = null;

    let richBannerDiv = null;

    let tadsReward = null;


    let rewardedToggle = 0;
    let bannerToggle = 0;

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

            //onclickBannerDiv = document.querySelector('[data-banner="6079882"]');
            //if (onclickBannerDiv) {
            //    onclickBannerDiv.style.display = "none";
            //}

            onclickBannerDiv = document.createElement("div");
            onclickBannerDiv.setAttribute("data-banner", "6079882");
            onclickBannerDiv.style.display = "none";
            document.body.appendChild(onclickBannerDiv);

            window.TelegramAdsController = new TelegramAdsController();
            window.TelegramAdsController.initialize({
                pubId: "978045",
                appId: "2700",
            });

            //richBannerDiv = document.getElementById('rich-banner-365397');
            //if (richBannerDiv) {
            //    richBannerDiv.style.display = "none";
            //}
            richBannerDiv = document.createElement("div");
            richBannerDiv.setAttribute("id", "rich-banner-365397");
            richBannerDiv.style.display = "none";
            document.body.appendChild(richBannerDiv);

            const tadsContainer = document.createElement("div");
            tadsContainer.setAttribute("id", "tads-container-531");
            document.body.appendChild(tadsContainer); 

            const adsNotFoundCallback = () => {
                console.log('No ads found to show');
            };

            const onClickRewardCallback = (adId) => {
                console.log('Clicked ad:', adId);
            };

            const onShowRewardCallback = (adId) => {
                console.log('Showed ad: ', adId);
            };

            tadsReward = window.tads.init({
                widgetId: 531,
                type: 'static',
                debug: false,
                onShowReward: onShowRewardCallback,
                onClickReward: onClickRewardCallback,
                onAdsNotFound: adsNotFoundCallback
            });
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
            const source = rewardedToggle % 4;

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
                // RichAds
                console.log("RichAds Reward");
                if (window.TelegramAdsController) {
                    window.TelegramAdsController.triggerInterstitialVideo().then(() => {
                        onSuccess?.(rewardData);
                        trackEventGA("reward_shown", "source", "richads");
                    }).catch((err) => {
                        onError?.(err);
                    });
                } else {
                    onError?.("TelegramAdsController not available");
                }
                
            } else if (source === 2) {
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
            } else if (source === 3) {
                // Tads
                console.log("Tads Reward");
                if (tadsReward) {
                    tadsReward.loadAd()
                        .then(() => {
                            tadsReward.showAd();
                            onSuccess?.(rewardData);
                            trackEventGA("reward_shown", "source", "tads");
                        })
                        .catch((err) => {
                            onError?.(err);
                        });
                }
            }

            rewardedToggle++;
        },

        showBanner: function () {

            if (!onclickBannerDiv) {
                onclickBannerDiv = document.querySelector('[data-banner="6079882"]');
            }

            if (!richBannerDiv) {
                richBannerDiv = document.getElementById('rich-banner-365397');
            }

            if (bannerToggle % 2 === 0) {
                console.log("RichAds Banner");
                if (richBannerDiv) richBannerDiv.style.display = "flex";
                if (onclickBannerDiv) onclickBannerDiv.style.display = "none";
            } else {
                console.log("OnClick Banner");
                if (onclickBannerDiv) onclickBannerDiv.style.display = "flex";
                if (richBannerDiv) richBannerDiv.style.display = "none";
            }
            bannerToggle++;
        },

        hideBanner: function () {
            if (richBannerDiv) {
                richBannerDiv.style.display = "none";
            }
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