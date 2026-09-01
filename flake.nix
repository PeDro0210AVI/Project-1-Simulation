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

                  numpy
                  scipy
                  scikit-learn
                ];
              pythonEnv = pkgs.python3.withPackages pythonPackages;
            in
            function {
              inherit
                pkgs
                pythonEnv
                ;

            }
          );
    in
    {

      #TODO: make a darwin and linux different packages

      templates.default.path = ./.;

      devShells = forAllSystems (
        {
          pkgs,
          pythonEnv,
        }:
        {
          default =

            pkgs.mkShell {

              packages = [
                pythonEnv
                pkgs.texliveFull
              ];

            };
        }
      );

    };
}
