export default {
	"src/**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
	"src/**/*.{ts,tsx,css}": ["biome check --write", "biome format --write"],
};
