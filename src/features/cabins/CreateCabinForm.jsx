import FormRow from '../../ui/FormRow';
import { useForm } from 'react-hook-form';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';

function CreateCabinForm() {
  const { register, handleSubmit, reset, formState, getValues } = useForm();

  const { errors } = formState;

  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success('New cabin item successfully created');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    mutate({ ...data, image: data.image[0] });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        {/* <Label htmlFor="name">Cabin name</Label> */}
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        {/* <Label htmlFor="maxCapacity">Maximum capacity</Label> */}
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be atleast 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="RegularPrice" error={errors?.regularPrice?.message}>
        {/* <Label htmlFor="regularPrice">Regular price</Label> */}
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Price should be atleast 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        {/* <Label htmlFor="discount">Discount</Label> */}
        <Input
          type="number"
          id="discount"
          disabled={isCreating}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              'Discount price should be less than the regular price.',
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        {/* <Label htmlFor="description">Description for website</Label> */}
        <Textarea
          type="number"
          id="description"
          disabled={isCreating}
          defaultValue=""
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Cabin Photo" error={errors?.image?.message}>
        {/* <Label htmlFor="image">Cabin photo</Label> */}
        <FileInput
          id="image"
          disabled={isCreating}
          accept="image/*"
          {...register('image', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
