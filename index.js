const { metro, patcher } = vendetta;

export default {
    onLoad: () => {
        const UserStore = metro.findByStoreName("UserStore");
        
        // Patchuje użytkownika, aby zawsze zwracał nick "funny"
        patcher.after("getCurrentUser", UserStore, (_, user) => {
            if (user) {
                user.username = "funny";
                user.globalName = "funny";
            }
        });
    },
    onUnload: () => {
        patcher.unpatchAll();
    }
};
