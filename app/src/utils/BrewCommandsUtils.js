export function generateBrewCommands(categories, selectedPackages) {
  const allPackages = categories.flatMap((c) => c.packages);
  const selectedPkgs = Array.from(selectedPackages)
    .map((name) => allPackages.find((p) => p.name === name))
    .filter(Boolean);
  const commands = [];
  addOutdatedPackagesCommand(commands, allPackages);

  if (selectedPkgs.length === 0 && commands.length === 0) {
    commands.push("# Select packages to generate install and uninstall commands")
  } else {
    addInstallCommands(commands, selectedPkgs);
    addUninstallCommands(commands, selectedPkgs);
  }
  commands.push("brew cleanup # Consider to remove old versions and free disk space");

  return commands;
}

function addOutdatedPackagesCommand(commands, allPackages) {
  const outdatedCount = allPackages.filter((p) => p.outdated).length;
  if (outdatedCount > 0) {
    commands.push(
      `brew upgrade # You have ${outdatedCount} outdated package${outdatedCount > 1 ? "s" : ""}`,
    );
  }
}

function addInstallCommands(commands, selectedPkgs) {
  const toInstall = selectedPkgs.filter((p) => !p.installed);

  const installCasks = toInstall
    .filter((p) => p.cask)
    .map((p) => {
      return p.tap ? `${p.tap}/${p.token}` : p.token;
    })
    .sort();

  const installFormulas = toInstall
    .filter((p) => !p.cask)
    .map((p) => {
      return p.tap ? `${p.tap}/${p.name}` : p.name;
    })
    .sort();

  if (installFormulas.length) {
    commands.push(`brew install ${installFormulas.join(" ")}`);
  }

  if (installCasks.length) {
    commands.push(`brew install --cask ${installCasks.join(" ")}`);
  }
}

function addUninstallCommands(commands, selectedPkgs) {
  const toUninstall = selectedPkgs.filter((p) => p.installed);

  const uninstallCasks = toUninstall
  .filter((p) => p.cask)
  .map((p) => {
    return p.tap ? `${p.tap}/${p.token}` : p.token;
  })
  .sort();

  const uninstallFormulas = toUninstall
  .filter((p) => !p.cask)
  .map((p) => {
    return p.tap ? `${p.tap}/${p.name}` : p.name;
  })
  .sort();

  if (uninstallFormulas.length) {
    commands.push(`brew uninstall ${uninstallFormulas.join(" ")}`);
  }

  if (uninstallCasks.length) {
    commands.push(`brew uninstall --cask ${uninstallCasks.join(" ")}`);
  }
}
