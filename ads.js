(function () {
    let unityInstance = null;
    let interstitialAdsgram = null;
    let rewardedAdsgram = null;

    let onclickRewardedInitialized = false;
    let onclickRewardedShow = null;
    let onclickBannerDiv = null;

    let richBannerDiv = null;

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
                window.initCdTma({ id: "338543" })
                    .then(show => {
                        onclickRewardedInitialized = true;
                        onclickRewardedShow = show;
                    })
                    .catch(e => console.error("Onclick Rewarded init error:", e));
            }

            onclickBannerDiv = document.createElement("div");
            onclickBannerDiv.setAttribute("data-banner", "6079882");
            onclickBannerDiv.style.display = "none"; 
            document.body.appendChild(onclickBannerDiv);

            window.TelegramAdsController = new TelegramAdsController();
            window.TelegramAdsController.initialize({
                pubId: "978045",
                appId: "2700",
            });

            richBannerDiv = document.createElement("div");
            richBannerDiv.setAttribute("rich-banner");
            richBannerDiv.style.display = "none";
            document.body.appendChild(richBannerDiv);
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
            const source = rewardedToggle % 3;

            if (source === 0) {
                // Adsgram
                if (rewardedAdsgram) {
                    rewardedAdsgram.show()
                        .then(() => onSuccess?.(rewardData))
                        .catch(err => onError?.(err));
                } else {
                    onError?.("Rewarded Adsgram not initialized");
                }
            } else if (source === 1) {
                // RichAds
                if (window.TelegramAdsController) {
                    window.TelegramAdsController.triggerInterstitialBanner()
                        .then((result) => onSuccess?.(rewardData))
                        .catch(err => onError?.(err));
                } else {
                    onError?.("TelegramAdsController not available");
                }
            } else if (source === 2) {
                // Onclick
                if (onclickRewardedInitialized && onclickRewardedShow) {
                    onclickRewardedShow()
                        .then(() => onSuccess?.(rewardData))
                        .catch(err => onError?.(err));
                } else {
                    onError?.("Onclick Rewarded not ready");
                }
            }

            rewardedToggle++;
        },

        showBanner: function () {
            if (bannerToggle % 2 === 0) {
                if (richBannerDiv) richBannerDiv.style.display = "block";
                if (onclickBannerDiv) onclickBannerDiv.style.display = "none";
            } else {
                if (onclickBannerDiv) onclickBannerDiv.style.display = "block";
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
        }
    };
})();