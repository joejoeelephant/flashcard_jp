export default defineEventHandler((event:any) => {
  if(event.context.error) {
    throw createError(event.context.error)
  }
  return {
      hello: 'world'
    }
  })