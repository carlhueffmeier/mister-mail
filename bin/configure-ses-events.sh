#!/bin/bash

MUSTACHE_BIN="/node_modules/mustache/bin/mustache"
INPUT_JSON="/resources/ses-configuration-set-event-destination.json"

# Go to project root
cd "$(dirname "$0")"
cd ..
PWD=$(pwd)

get_cmd()
{
  source_path=$(realpath "$0")
  echo $(basename "$source_path")
}

usage()
{
    echo "Usage: $(get_cmd) [--help | --configuration-set NAME --topic ARN]"
    echo "Configures the given SNS topic as event destination for the specified SES ConfigurationSet"
}

generate_config()
{
  echo '{ "ConfigurationSetName": "'"$1"'", "TopicARN": "'"$2"'" }' | $PWD/$MUSTACHE_BIN - $PWD/$INPUT_JSON
}

# Parse command line flags
configuration_set=""
topic=""

while [ "$1" != "" ]; do
    case $1 in
        -c | --configuration-set )          shift
                                            configuration_set=$1
                                            ;;
        -t | --topic )                      shift
                                            topic=$1
                                            ;;
        -h | --help )                       usage
                                            exit
                                            ;;
        * )                                 usage
                                            exit 1
    esac
    shift
done

# Generate configuration
config_json=$(generate_config "${configuration_set}" "${topic}")
echo This is the config: ${config_json}

# Apply configuration
# aws ses create-configuration-set-event-destination --generate-cli-skeleton

echo "Successfully created event destination for ${configuration_set}"