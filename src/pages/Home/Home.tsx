/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from 'react';
import { ScriptWiz, VM, VM_NETWORK, VM_NETWORK_VERSION } from '@script-wiz/lib';
import ScriptNavbar from '../../components/ScriptNavbar/ScriptNavbar';
import ScriptEditor from '../../components/ScriptEditor/ScriptEditor';

type Props = {
  extension?: any;
};

export const Home: React.FC<Props> = ({ extension }) => {
  const [scriptWiz, setScriptWiz] = useState<ScriptWiz>();
  const [vm, setVm] = useState<VM>({
    network: VM_NETWORK.LIQUID,
    ver: VM_NETWORK_VERSION.SEGWIT,
  });

  console.log('extension', extension);

  useEffect(() => {
    const scriptWizInstance = new ScriptWiz(vm, extension);
    setScriptWiz(scriptWizInstance);
  }, [extension, vm, vm.network, vm.ver]);

  if (scriptWiz !== undefined) {
    return (
      <div style={{ height: '100%' }}>
        <ScriptNavbar
          vm={vm}
          onSelectVm={(selectedVm: VM) => {
            // Todo review
            if (selectedVm.network !== vm.network || selectedVm.ver !== vm.ver) setVm(selectedVm);
          }}
        />
        <ScriptEditor scriptWiz={scriptWiz} />
      </div>
    );
  }

  return <span>something went wrong</span>;
};
