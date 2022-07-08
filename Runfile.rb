# Sadly we cannot use a docker development image because Vite is replacing `0.0.0.0` by
# `localhost` on-the-fly:
# https://github.com/vitejs/vite/blob/main/packages/vite/src/node/utils.ts#L790
#
# require_extension "docker_v1.4.0"

task :dev do
  shell "npx vite"
end

task :build do
  shell "npx run-p type-check build-only"
end

task :preview do
  shell "npx vite preview --port 4173"
end

task :test_unit do
  shell "npx vitest --environment jsdom"
end

task :test_e2e do
  shell "npx start-server-and-test preview http://127.0.0.1:4173/ 'cypress open --e2e'"
end

task :test_e2e_ci do
  shell "npx start-server-and-test preview http://127.0.0.1:4173/ 'cypress run --e2e'"
end

task :build_only do
  shell "npx vite build"
end

task :type_check do
  shell "npx vue-tsc --noEmit -p tsconfig.vitest.json --composite false"
end

task :lint do
  shell "npx eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix " \
        "--ignore-path .gitignore"
end
