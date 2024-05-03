#!/usr/bin/env bash

# Comment unsupported background feat init

DIR="$( cd "$( dirname "$0" )" && pwd -P )"
file_path=${DIR}/../../background/src/index.ts

# Check if the file exists
if [ ! -f "$file_path" ]; then
  echo "Background Module Error: File '$file_path' not found."
  exit 1
fi

# Print the original file content
# echo "Original content of $file_path:"
# cat "$file_path"

###################################################################
# Auto lock account service
auto_lock='import \* as AutoLocker from "\./auto-lock-account/internal";'
auto_lock_replacement="\/\/ $auto_lock"
# Uncomment
sed -i'' -e "s|$auto_lock_replacement|$auto_lock|g" "$file_path"

###################################################################
# Define the start for the code block
auto_lock_service_upattern='//  const autoLockAccountService = new AutoLocker.AutoLockAccountService('

# Use awk to uncomment the code block while preserving line breaks
awk -v start="$auto_lock_service_upattern" '
  # If a line matches the commented start pattern, set a flag to begin uncommenting
  index($0, start) {
    uncomment_flag = 1
  }
  # If the uncomment flag is set, remove the comment characters
  uncomment_flag {
    sub("//  ", "", $0)
  }
  # If a line ends the code block (contains ");"), unset the flag to stop uncommenting
  index($0, ");") && uncomment_flag {
    uncomment_flag = 0
  }
  # Print the line
  1
' "$file_path" > tmpfile && mv tmpfile "$file_path"

###################################################################
auto_lock_sinit='AutoLocker.init(router, autoLockAccountService);'
auto_lock_sinit_replacement="\/\/ $auto_lock_sinit"
sed -i'' -e "s|$auto_lock_sinit_replacement|$auto_lock_sinit|g" "$file_path"

###################################################################
auto_lock_init='await autoLockAccountService.init(keyRingService);'
auto_lock_init_replacement="\/\/ $auto_lock_init"
sed -i'' -e "s|$auto_lock_init_replacement|$auto_lock_init|g" "$file_path"

###################################################################
# Umbral service
umbral='import \* as Umbral from "\./umbral/internal";'
umbral_replacement="\/\/ $umbral"
sed -i'' -e "s|$umbral_replacement|$umbral|g" "$file_path"

###################################################################
umbral_service='const umbralService = new Umbral.UmbralService(chainsService);'
umbral_service_replacement="\/\/ $umbral_service"
sed -i'' -e "s|$umbral_service_replacement|$umbral_service|g" "$file_path"

###################################################################
umbral_sinit='Umbral.init(router, umbralService);'
umbral_sinit_replacement="\/\/ $umbral_sinit"
sed -i'' -e "s|$umbral_sinit_replacement|$umbral_sinit|g" "$file_path"

###################################################################
umbral_init='await umbralService.init(keyRingService, permissionService);'
umbral_init_replacement="\/\/ $umbral_init"
sed -i'' -e "s|$umbral_init_replacement|$umbral_init|g" "$file_path"

# Removing index.ts-e file
rm -rf "${DIR}/../../background/src/index.ts-e"

# Check if the replacement was successful
if [ $? -eq 0 ]; then
  echo "Supported feat updates completed successfully."
else
  echo "Background Module Error: Supported feat updates failed."
fi
