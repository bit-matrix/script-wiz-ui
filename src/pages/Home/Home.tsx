import React from 'react';
import { ScriptWiz, VM } from '@script-wiz/lib';
import { ScriptNavbar } from '../../components/ScriptNavbar/ScriptNavbar';
import { ScriptEditor } from '../../components/ScriptEditor/ScriptEditor';

type Props = {
  vm: VM;
  scriptWiz?: ScriptWiz;
  setVm: (vm: VM) => void;
};

export const Home: React.FC<Props> = ({ vm, scriptWiz, setVm }) => {
  console.log(scriptWiz);
  if (scriptWiz !== undefined) {
    return (
      <div style={{ height: '100%' }}>
        <ScriptNavbar
          vm={vm}
          onSelectVm={(selectedVm: VM) => {
            if (selectedVm.network !== vm.network || selectedVm.ver !== vm.ver) setVm(selectedVm);
          }}
        />
        <ScriptEditor scriptWiz={scriptWiz} />
      </div>
    );
  }

  return <span>something went wrong</span>;
};
