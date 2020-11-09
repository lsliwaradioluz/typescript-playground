export function BindThis(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const updatedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        },
    };
    return updatedDescriptor;
}
