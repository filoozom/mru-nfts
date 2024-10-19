import {
  ExecutionLog,
  BlockInfo,
  AllowedInputTypes,
  Transition,
  SchemaType,
  StateWrapType,
  InferInputTypeFromSchemaType,
} from "@stackr/sdk/machine";

import { ERC721State } from "../state";

// NOTE: This is not exported from @stackr/sdk/machine for some reason
export interface Args<WrappedState = unknown, InputType = AllowedInputTypes> {
  state: WrappedState;
  inputs: InputType;
  signature: string;
  msgSender: string;
  block: BlockInfo;
  emit: (log: ExecutionLog) => void;
}

export const call = <
  InputSchemaType extends SchemaType | AllowedInputTypes,
  Arguments extends Args<
    StateWrapType<ERC721State>,
    InputSchemaType extends SchemaType
      ? InferInputTypeFromSchemaType<InputSchemaType>
      : AllowedInputTypes
  >
>(
  fn: Transition<ERC721State, InputSchemaType>,
  source: Pick<Arguments, "emit" | "msgSender" | "block">,
  state: Arguments["state"],
  inputs: Arguments["inputs"]
) => {
  const { emit, msgSender, block } = source;
  return fn.handler({ emit, msgSender, block, signature: "", state, inputs });
};
