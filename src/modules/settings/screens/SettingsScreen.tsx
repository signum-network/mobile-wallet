import React, {useRef, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import VersionNumber from 'react-native-version-number';
import {BSelect, SelectItem} from '../../../core/components/base/BSelect';
import {
  Button,
  ButtonSizes,
  ButtonThemes,
} from '../../../core/components/base/Button';
import {Text} from '../../../core/components/base/Text';
import {HeaderTitle} from '../../../core/components/header/HeaderTitle';
import {i18n} from '../../../core/i18n';
import {FullHeightView} from '../../../core/layout/FullHeightView';
import {Screen} from '../../../core/layout/Screen';
import {AppReduxState} from '../../../core/store/app/reducer';
import {Colors} from '../../../core/theme/colors';
import {FontSizes, Sizes} from '../../../core/theme/sizes';
import {resetAuthState} from '../../accounts/store/actions';
import {AuthReduxState} from '../../accounts/store/reducer';
import {settings} from '../translations';
import {resetAppState, setNode} from '../../../core/store/app/actions';
import {defaultSettings} from '../../../core/environment';
import {useNavigation} from '@react-navigation/native';
import {selectCurrentNode} from '../../../core/store/app/selectors';
import {logos, settingsIcons} from '../../../assets/icons';
import {ResetModal} from '../../../core/components/modals/ResetModal';
import {RootStackParamList} from '../../accounts/navigation/mainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {ApplicationState} from '../../../core/store/initialState';
import {BInput} from '../../../core/components/base/BInput';
import {LedgerClientFactory} from '@signumjs/core';
import {LoadingIndicator} from '../../../core/components/base/LoadingIndicator';
import {SwitchItem} from '../../../core/components/base/SwitchItem';

type SettingsScreenNavProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type Props = {
  auth: AuthReduxState;
  app: AppReduxState;
  navigation: SettingsScreenNavProp;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  settingsZone: {
    marginVertical: Sizes.LARGE,
    position: 'relative',
    padding: Sizes.MEDIUM,
    borderRadius: 4,
    borderColor: Colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
    flexGrow: 1,
  },
  fillZone: {
    flex: 2,
  },
  hintView: {
    paddingTop: Sizes.SMALL,
    flex: 1,
  },
  bodyText: {
    padding: 10,
  },
  customNodeContainer: {
    marginVertical: Sizes.SMALL,
  },
  dangerZone: {
    position: 'relative',
    flex: 1,
    padding: Sizes.MEDIUM,
    borderRadius: 4,
    borderColor: Colors.WHITE,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  dangerZoneLabel: {
    position: 'absolute',
    backgroundColor: Colors.BLUE,
    top: -10,
    left: 8,
    paddingHorizontal: 2,
  },
  flexBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signumjs: {
    height: 40,
    width: 40,
    marginRight: 8,
  },
  versionInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 2,
    width: 20,
    height: 20,
    backgroundColor: Colors.TRANSPARENT,
  },
  acceptButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  customNodeSwitch: {
    paddingVertical: Sizes.MEDIUM,
  },
});

interface NodeInformation {
  version: string;
  networkName: string;
}

const Settings = ({}: Props) => {
  const verifyTimeoutRef = useRef<number | undefined>();
  const dispatch = useDispatch();
  const navigation = useNavigation<SettingsScreenNavProp>();
  const [erasePromptVisible, setErasePromptVisible] = useState(false);
  const [nodeEditorEnabled, setNodeEditorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<NodeInformation | null>(null);
  const currentNode = useSelector(selectCurrentNode);
  const [customNode, setCustomNode] = useState(currentNode);

  const toggleConfirmDeletePrompt = () => {
    setErasePromptVisible(!erasePromptVisible);
  };

  const confirmErase = async () => {
    await dispatch(resetAuthState());
    await dispatch(resetAppState());
    navigation.navigate('Accounts');
    toggleConfirmDeletePrompt();
  };

  const handleNodeSelect = (node: string) => {
    if (node !== currentNode) {
      dispatch(setNode(node));
    }
  };

  const verifyNode = async (nodeUrl: URL): Promise<NodeInformation> => {
    const api = LedgerClientFactory.createClient({
      nodeHost: nodeUrl.origin,
    });

    const [info, status] = await Promise.all([
      api.network.getNetworkInfo(),
      api.network.getBlockchainStatus(),
    ]);
    return {
      networkName: info.networkName,
      version: status.version,
    };
  };

  const handleSetCustomNode = async (url: string) => {
    try {
      setCustomNode(url);
      const nodeUrl = new URL(url);
      verifyTimeoutRef.current && clearTimeout(verifyTimeoutRef.current);
      verifyTimeoutRef.current = setTimeout(() => {
        setLoading(true);
      }, 300);
      const info = await verifyNode(nodeUrl);
      console.log('Custom Node', info);
      setNodeInfo(info);
    } catch (e) {
      setNodeInfo(null);
    } finally {
      verifyTimeoutRef.current && clearTimeout(verifyTimeoutRef.current);
      setLoading(false);
    }
  };

  const handleAcceptNode = () => {
    dispatch(setNode(customNode));
  };

  // it should be memo'ed but it seems it causes trouble on updated version... not sure what's happening,
  // so, I use this annoying re-render hoping that the error is fixed.
  const getListItems = () => {
    const nodeHosts: String[] = defaultSettings.reliableNodeHosts;
    if (
      currentNode &&
      !nodeHosts.find(n => n.toLowerCase() === currentNode.toLowerCase())
    ) {
      nodeHosts.push(currentNode);
    }

    nodeHosts.sort();
    return nodeHosts.map(
      n =>
        ({
          label: n,
          value: n,
        } as SelectItem<string>),
    );
  };

  return (
    <Screen>
      <FullHeightView>
        <HeaderTitle>{i18n.t(settings.screens.settings.title)}</HeaderTitle>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.settingsZone}>
              <BSelect
                value={currentNode}
                items={getListItems()}
                onChange={handleNodeSelect}
                title={i18n.t(settings.screens.settings.selectNode)}
                placeholder={i18n.t(settings.screens.settings.selectNode)}
              />
              <View style={styles.customNodeContainer}>
                <View style={styles.customNodeSwitch}>
                  <SwitchItem
                    onChange={setNodeEditorEnabled}
                    text={i18n.t(settings.screens.settings.setCustomNode)}
                    value={nodeEditorEnabled}
                    labelColor={Colors.WHITE}
                  />
                </View>
                {nodeEditorEnabled && (
                  <>
                    <View>
                      <BInput
                        value={customNode}
                        onChange={handleSetCustomNode}
                      />
                    </View>
                    <LoadingIndicator show={loading} showDelay={0} />
                    {nodeInfo && !loading && (
                      <View style={styles.versionInfo}>
                        <Text size={FontSizes.SMALLER} color={Colors.WHITE}>
                          {nodeInfo.networkName} {nodeInfo.version}
                        </Text>
                        <Button
                          theme={ButtonThemes.ACCENT}
                          onPress={handleAcceptNode}
                          size={ButtonSizes.SMALL}>
                          <View style={styles.acceptButton}>
                            <Image
                              source={settingsIcons.check}
                              style={styles.checkIcon}
                            />
                            <Text size={FontSizes.SMALL} color={Colors.WHITE}>
                              {i18n.t(settings.screens.settings.apply)}
                            </Text>
                          </View>
                        </Button>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
            <View style={styles.fillZone} />
            <View style={styles.dangerZone}>
              <View style={styles.dangerZoneLabel}>
                <Text color={Colors.WHITE} size={FontSizes.SMALLER}>
                  Danger Zone
                </Text>
              </View>
              <Button
                theme={ButtonThemes.DANGER}
                onPress={toggleConfirmDeletePrompt}>
                {i18n.t(settings.screens.settings.erase)}
              </Button>
            </View>

            <View style={[styles.flexBottom, styles.bodyText]}>
              <View>
                <Image source={logos.signumjs} style={styles.signumjs} />
              </View>
              <View>
                <Text color={Colors.WHITE} size={FontSizes.SMALLER}>
                  Signum Mobile Wallet {VersionNumber.appVersion} (
                  {VersionNumber.buildVersion})
                </Text>
                <Text color={Colors.WHITE} size={FontSizes.SMALLER}>
                  {i18n.t(settings.screens.settings.copyright)}
                </Text>
                <Text color={Colors.WHITE} size={FontSizes.SMALLER}>
                  {i18n.t(settings.screens.settings.credits)}
                </Text>
              </View>
            </View>
            <ResetModal
              visible={erasePromptVisible}
              onConfirm={confirmErase}
              onCancel={toggleConfirmDeletePrompt}
            />
          </View>
        </ScrollView>
      </FullHeightView>
    </Screen>
  );
};

function mapStateToProps(state: ApplicationState) {
  return {
    auth: state.auth,
    app: state.app,
  };
}

export const SettingsScreen = connect(mapStateToProps)(Settings);
