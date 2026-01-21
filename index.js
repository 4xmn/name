const { metro, patcher, storage } = vendetta;
const { React } = vendetta.metro.common;
const { Forms } = vendetta.ui.components;

// Domyślne ustawienia
storage.username ??= "funny";

export default {
    onLoad: () => {
        const UserStore = metro.findByStoreName("UserStore");
        
        // Zmiana Username (używa wartości z ustawień lub domyślnego "funny")
        patcher.after("getCurrentUser", UserStore, (_, user) => {
            if (user) {
                const customName = storage.username || "funny";
                user.username = customName;
                user.globalName = customName;
            }
        });

        // Zamiana tekstów (osobno -> funny)
        const MessageModule = metro.findByProps("MessageContent", "default");
        if (MessageModule) {
            patcher.after("default", MessageModule, ([{ message }], res) => {
                const replacements = {
                    "osobno": "funny",
                    "@gmail.com": "@cia.gov"
                };

                for (const [old, newVal] of Object.entries(replacements)) {
                    if (res?.props?.children) {
                        const walk = (node) => {
                            if (typeof node === "string") return node.replace(new RegExp(old, "gi"), newVal);
                            if (Array.isArray(node)) return node.map(walk);
                            if (node?.props?.children) node.props.children = walk(node.props.children);
                            return node;
                        };
                        walk(res.props.children);
                    }
                }
            });
        }
    },
    onUnload: () => {
        patcher.unpatchAll();
    },
    // Sekcja ustawień wyświetlana w Revenge
    settings: () => {
        const [value, setValue] = React.useState(storage.username);

        return React.createElement(Forms.FormSection, { title: "Ustawienia Nicku" },
            React.createElement(Forms.FormInput, {
                label: "Twój własny Username",
                value: value,
                placeholder: "funny",
                onChange: (v) => {
                    storage.username = v;
                    setValue(v);
                }
            })
        );
    }
};
