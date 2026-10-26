import {
  ICreateRoomOpts,
  ICreateRoomStateEvent,
  JoinRule,
  MatrixClient,
  RestrictedAllowType,
  Room,
} from 'matrix-js-sdk';
import { RoomJoinRulesEventContent } from 'matrix-js-sdk/lib/types';
import { RoomType, StateEvent } from '../../../types/matrix/room';
import { getViaServers } from '../../plugins/via-servers';
import { getMxIdServer } from '../../utils/matrix';
import { CreateRoomAccess } from './types';

export const createRoomCreationContent = (
  type: RoomType | undefined,
  allowFederation: boolean,
  additionalCreators: string[] | undefined
): object => {
  const content: Record<string, any> = {};
  if (typeof type === 'string') {
    content.type = type;
  }
  if (allowFederation === false) {
    content['m.federate'] = false;
  }
  if (Array.isArray(additionalCreators)) {
    content.additional_creators = additionalCreators;
  }

  return content;
};

export const createRoomJoinRulesState = (
  access: CreateRoomAccess,
  parent: Room | undefined,
  knock: boolean
) => {
  let content: RoomJoinRulesEventContent = {
    join_rule: knock ? JoinRule.Knock : JoinRule.Invite,
  };

  if (access === CreateRoomAccess.Public) {
    content = {
      join_rule: JoinRule.Public,
    };
  }

  if (access === CreateRoomAccess.Restricted && parent) {
    content = {
      join_rule: knock ? ('knock_restricted' as JoinRule) : JoinRule.Restricted,
      allow: [
        {
          type: RestrictedAllowType.RoomMembership,
          room_id: parent.roomId,
        },
      ],
    };
  }

  return {
    type: StateEvent.RoomJoinRules,
    state_key: '',
    content,
  };
};

export const createRoomParentState = (parent: Room) => ({
  type: StateEvent.SpaceParent,
  state_key: parent.roomId,
  content: {
    canonical: true,
    via: getViaServers(parent),
  },
});

const createSpacePowerLevelsOverride = () => ({
  events_default: 50,
});

/**
 * Creation content for a DM: federation is disabled when every invitee is on
 * our own homeserver, and left enabled otherwise so remote users can still join.
 */
export const createDMCreationContent = (mx: MatrixClient, userIds: string[]): object => {
  const ownServer = getMxIdServer(mx.getSafeUserId());
  const allLocal = userIds.every((userId) => getMxIdServer(userId) === ownServer);
  return createRoomCreationContent(undefined, !allLocal, undefined);
};

export const createRoomEncryptionState = () => ({
  type: 'm.room.encryption',
  state_key: '',
  content: {
    algorithm: 'm.megolm.v1.aes-sha2',
  },
});

export const createRoomCallState = () => ({
  type: 'org.matrix.msc3401.call',
  state_key: '',
  content: {},
});

export const createVoiceRoomPowerLevelsOverride = () => ({
  events: {
    [StateEvent.GroupCallMemberPrefix]: 0,
  },
});

export type CreateRoomData = {
  version: string;
  type?: RoomType;
  parent?: Room;
  access: CreateRoomAccess;
  name: string;
  topic?: string;
  aliasLocalPart?: string;
  encryption?: boolean;
  knock: boolean;
  allowFederation: boolean;
  additionalCreators?: string[];
};
export const createRoom = async (mx: MatrixClient, data: CreateRoomData): Promise<string> => {
  const initialState: ICreateRoomStateEvent[] = [];

  if (data.encryption) {
    initialState.push(createRoomEncryptionState());
  }

  if (data.parent) {
    initialState.push(createRoomParentState(data.parent));
  }

  if (data.type === RoomType.Call) {
    initialState.push(createRoomCallState());
  }

  initialState.push(createRoomJoinRulesState(data.access, data.parent, data.knock));

  const options: ICreateRoomOpts = {
    room_version: data.version,
    name: data.name,
    topic: data.topic,
    room_alias_name: data.aliasLocalPart,
    creation_content: createRoomCreationContent(
      data.type,
      data.allowFederation,
      data.additionalCreators
    ),
    power_level_content_override:
      data.type === RoomType.Call ? createVoiceRoomPowerLevelsOverride() : undefined,
    initial_state: initialState,
  };

  if (data.type === RoomType.Space) {
    options.power_level_content_override = createSpacePowerLevelsOverride();
  }

  const result = await mx.createRoom(options);

  if (data.parent) {
    await mx.sendStateEvent(
      data.parent.roomId,
      StateEvent.SpaceChild as any,
      {
        auto_join: false,
        suggested: false,
        via: [getMxIdServer(mx.getUserId() ?? '') ?? ''],
      },
      result.room_id
    );
  }

  return result.room_id;
};
