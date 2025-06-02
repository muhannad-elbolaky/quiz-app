import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        open: true,
    },
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                exam: "exam.html",
                end: "end.html",
                questions: "questions.html",
                generator: "generator.html",
                credits: "credits.html",
            },
        },
    },
    plugins: [tsconfigPaths()],
});
