export default {
    onLoad() {
        this.replacement = "67";

        this.interval = setInterval(() => {
            this.patchProfile();
        }, 800);
    },

    patchProfile() {
        // try to detect "You / Profile" screen area
        const profile =
            document.querySelector('[class*="profile"]') ||
            document.querySelector('[class*="account"]') ||
            document.querySelector('[class*="user"]');

        if (!profile) return;

        const walker = document.createTreeWalker(
            profile,
            NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            if (!node.nodeValue) continue;

            const parent = node.parentElement;
            if (!parent) continue;

            // avoid inputs
            if (
                parent.closest('[contenteditable="true"]') ||
                parent.closest('textarea') ||
                parent.closest('[role="textbox"]')
            ) continue;

            // only replace likely username-like text
            const text = node.nodeValue;

            if (text.trim().toLowerCase() === "ngsr") {
                node.nodeValue = this.replacement;
            }
        }
    },

    onUnload() {
        if (this.interval) clearInterval(this.interval);
    }
};
