{

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.11";
  };

  outputs =
    {
      nixpkgs,
      ...
    }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs
          [
            "x86_64-linux"
            "aarch64-darwin"
          ]
          (
            system:
            let
              pkgs = nixpkgs.legacyPackages.${system};
              pythonPackages =
                ps: with ps; [
                  ipykernel
                  jupyterlab-vim
                  jupyterlab
                  jupyterlab-lsp
                  python-lsp-server

                  virtualenv
                  pip
                  setuptools
                  wheel
                ];
              pythonEnv = pkgs.python3.withPackages pythonPackages;
              rustEnv = with pkgs; [
                cargo
                rust-analyzer
                clippy
                rustfmt
                taplo

              ];

              nativeBuildInputs = with pkgs; [
                glfw
                cmake
                clang
                cargo
                rustc
              ];
            in
            function {
              inherit
                pkgs
                pythonEnv
                rustEnv
                nativeBuildInputs
                ;

            }
          );
    in
    {

      templates.default.path = ./.;

      devShells = forAllSystems (
        {
          pkgs,
          pythonEnv,
          rustEnv,
          nativeBuildInputs,
        }:
        {
          default =

            pkgs.mkShell {

              inherit nativeBuildInputs;
              packages = with pkgs; [
                pythonEnv
                rustEnv

                maturin
                nodejs
              ];

              shellHook = ''
                virtualenv .venv && source .venv/bin/activate
              '';

            };
        }
      );

    };
}
