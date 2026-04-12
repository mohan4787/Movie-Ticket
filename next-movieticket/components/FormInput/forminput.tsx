'use client';
import { Button, Input, Radio, Select, Upload } from "antd";
import { InputType } from "../../config/constants.config";
import { UploadOutlined } from "@ant-design/icons";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useController } from "react-hook-form";

export interface IInputProps {
  control: any;
  name: string;
  errMsg?: string;
  type?: InputType;
  setThumbUrl?: Dispatch<SetStateAction<string>>;
}
export interface ISingleSelectOption {
  label: string;
  value: string;
}

export interface ISelectOptionProps {
  control: any;
  name: string;
  errMsg?: string;
  options: Array<ISingleSelectOption>;
  mode?: "multiple" | "tags";
  placeholder?: string; 
}

export const EmailInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IInputProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <>
            <Input type="email" autoComplete={name} id={name} {...field} />
            <span className="text-sm text-red-700 italic">{errMsg}</span>
          </>
        )}
      />
    </>
  );
};

export const PasswordInput = ({
  control,
  name,
  errMsg = "",
}: Readonly<IInputProps>) => {
  const { field } = useController({
    name: name,
    control: control,
  });

  return (
    <>
      <Input.Password autoComplete={name} id={name} {...field} />
      <span className="text-sm text-red-700 italic">{errMsg}</span>
    </>
  );
};

export const TextInput = ({
  control,
  name,
  errMsg = "",
  type = InputType.TEXT,
}: Readonly<IInputProps>) => {
  const { field } = useController({
    name: name,
    control: control,
  });

  return (
    <>
      <Input type={type} autoComplete={name} id={name} {...field} />
      <span className="text-sm text-red-700 italic">{errMsg}</span>
    </>
  );
};

export const SelectOptionsField = ({
  name,
  control,
  errMsg = "",
  options,
  mode,
}: Readonly<ISelectOptionProps>) => {
  const { field } = useController({
    name: name,
    control: control,
  });
  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  return (
    <>
      <Select
        {...field}
        showSearch
         mode={mode} 
        placeholder="Select any one "
        optionFilterProp="label"
        onSearch={onSearch}
        options={options}
        className="w-full"
      />
      <span className="text-sm text-red-700 italic">{errMsg}</span>
    </>
  );
};
export const RadioButtonField = ({
  name,
  control,
  errMsg = "",
  options,
}: Readonly<ISelectOptionProps>) => {
  const { field } = useController({ name, control });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Radio.Group {...field} className="flex flex-wrap">
        {options.map((opt) => (
          <Radio key={opt.value} value={opt.value}>
            <span className="text-white">{opt.label}</span>
          </Radio>
        ))}
      </Radio.Group>
      <span className="text-sm text-red-700 italic">{errMsg}</span>
    </div>
  );
};

export const SingleFiledUpload = ({
  name,
  control,
  errMsg = "",
  setThumbUrl = () => {},
}: Readonly<IInputProps>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className="flex flex-col gap-1 w-full custom-upload">
        <Upload
          beforeUpload={(file) => {
            field.onChange(file);
            setThumbUrl(URL.createObjectURL(file));
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />} className="bg-white/10 text-white border-white/20">
            Select A File
          </Button>
        </Upload>
        <style jsx global>{`
          .custom-upload .ant-upload-list-item-name { 
            color: white !important; 
          }
          .custom-upload .ant-upload-list-item-card-actions-btn {
            color: white !important;
          }
        `}</style>
        <span className="text-sm text-red-700 italic">{errMsg}</span>
      </div>
    )}
  />
);
