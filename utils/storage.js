export default {
    get(key) {
        try {
            const value = wx.getStorageSync(key);
            if (value) {
                return value;
            }
        } catch(e) {
            return null;
        }
    },

    set(key, value) {
        wx.setStorageSync(key, value);
    }
};